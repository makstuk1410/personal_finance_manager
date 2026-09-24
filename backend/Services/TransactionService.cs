using backend.Data;
using backend.DTOs.Transactions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TransactionService
{
    private readonly AppDbContext _context;
    public TransactionService(AppDbContext context) => _context = context;

    // A null request deletes, a null ID creates. All balance changes commit with the transaction row.
    public async Task<Transaction?> SaveAsync(int userId, int? id, TransactionRequest? request)
    {
        await using var databaseTransaction = await _context.Database.BeginTransactionAsync();
        Transaction? existing = null;
        if (id.HasValue)
        {
            var rows = await _context.Transactions.FromSqlInterpolated(
                $"SELECT * FROM \"Transactions\" WHERE \"Id\" = {id.Value} AND \"UserId\" = {userId} FOR UPDATE")
                .ToListAsync();
            existing = rows.SingleOrDefault();
            if (existing == null) return null;
        }

        var accountIds = new[] { existing?.SourceAccountId, existing?.DestinationAccountId,
            request?.SourceAccountId, request?.DestinationAccountId }
            .Where(value => value.HasValue).Select(value => value!.Value).Distinct().Order().ToArray();
        // Lock in a consistent order to avoid lost balances and cross-account deadlocks.
        var accounts = await _context.FinancialAccounts.FromSqlInterpolated(
            $"SELECT * FROM \"FinancialAccounts\" WHERE \"UserId\" = {userId} AND \"Id\" = ANY({accountIds}) ORDER BY \"Id\" FOR UPDATE")
            .ToDictionaryAsync(a => a.Id);
        if (accounts.Count != accountIds.Length)
            throw new TransactionInputException("Select accounts belonging to you.");

        if (request != null)
        {
            if (request.CategoryId.HasValue && !await _context.Categories.AnyAsync(c =>
                c.Id == request.CategoryId && (c.IsDefault || c.UserId == userId)))
                throw new TransactionInputException("Select an available category.");
            if (request.Type == TransactionType.Transfer && !string.Equals(
                accounts[request.SourceAccountId!.Value].Currency,
                accounts[request.DestinationAccountId!.Value].Currency, StringComparison.OrdinalIgnoreCase))
                throw new TransactionInputException("Transfers require accounts with the same currency.");
        }

        if (existing != null) ApplyBalance(existing, accounts, -1);
        var transaction = existing ?? new Transaction { UserId = userId };
        if (request == null)
        {
            _context.Transactions.Remove(transaction);
        }
        else
        {
            transaction.Type = request.Type!.Value;
            transaction.Amount = request.Amount;
            transaction.Date = request.Date!.Value;
            transaction.Description = request.Description?.Trim();
            transaction.SourceAccountId = request.SourceAccountId;
            transaction.DestinationAccountId = request.DestinationAccountId;
            transaction.CategoryId = request.CategoryId;
            ApplyBalance(transaction, accounts, 1);
            if (existing == null) _context.Transactions.Add(transaction);
        }
        if (accounts.Values.Any(a => Math.Abs(a.Balance) > 9999999999999999.99m))
            throw new TransactionInputException("The resulting balance exceeds the account's supported range.");

        await _context.SaveChangesAsync();
        await databaseTransaction.CommitAsync();
        return transaction;
    }

    private static void ApplyBalance(Transaction transaction, Dictionary<int, FinancialAccount> accounts, int direction)
    {
        if (transaction.SourceAccountId.HasValue)
            accounts[transaction.SourceAccountId.Value].Balance -= direction * transaction.Amount;
        if (transaction.DestinationAccountId.HasValue)
            accounts[transaction.DestinationAccountId.Value].Balance += direction * transaction.Amount;
    }
}

public class TransactionInputException(string message) : Exception(message);
