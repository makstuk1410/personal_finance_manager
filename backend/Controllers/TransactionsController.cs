using System.Security.Claims;
using backend.Data;
using backend.DTOs.Transactions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Controllers;

[ApiController, Authorize, Route("api/transactions")]
public class TransactionsController(AppDbContext context, TransactionService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetTransactions(DateOnly? from, DateOnly? to, int? categoryId,
        TransactionType? type, int? accountId, string sortBy = "date", string sortOrder = "desc")
    {
        if (!TryUserId(out var userId)) return Unauthorized();
        if (from > to || (type.HasValue && !Enum.IsDefined(type.Value)) ||
            (sortBy != "date" && sortBy != "amount") || (sortOrder != "asc" && sortOrder != "desc"))
            return BadRequest("Invalid date range, type, or sort option.");
        var query = context.Transactions.AsNoTracking().Where(t => t.UserId == userId);
        if (from.HasValue) query = query.Where(t => t.Date >= from.Value);
        if (to.HasValue) query = query.Where(t => t.Date <= to.Value);
        if (categoryId.HasValue) query = query.Where(t => t.CategoryId == categoryId.Value);
        if (type.HasValue) query = query.Where(t => t.Type == type.Value);
        if (accountId.HasValue) query = query.Where(t => t.SourceAccountId == accountId || t.DestinationAccountId == accountId);
        var ordered = sortBy == "amount"
            ? (sortOrder == "asc" ? query.OrderBy(t => t.Amount) : query.OrderByDescending(t => t.Amount))
            : (sortOrder == "asc" ? query.OrderBy(t => t.Date) : query.OrderByDescending(t => t.Date));
        return Ok((await ordered.ThenByDescending(t => t.Id).ToListAsync()).Select(TransactionResponse.From));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTransaction(int id)
    {
        if (!TryUserId(out var userId)) return Unauthorized();
        var transaction = await context.Transactions.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        return transaction == null ? NotFound() : Ok(TransactionResponse.From(transaction));
    }

    [HttpPost]
    public Task<IActionResult> Create(TransactionRequest request) => Save(null, request);

    [HttpPut("{id:int}")]
    public Task<IActionResult> Update(int id, TransactionRequest request) => Save(id, request);

    [HttpDelete("{id:int}")]
    public Task<IActionResult> Delete(int id) => Save(id, null);

    private async Task<IActionResult> Save(int? id, TransactionRequest? request)
    {
        if (!TryUserId(out var userId)) return Unauthorized();
        try
        {
            var transaction = await service.SaveAsync(userId, id, request);
            if (transaction == null) return NotFound();
            return id.HasValue ? NoContent() : CreatedAtAction(nameof(GetTransaction),
                new { id = transaction.Id }, TransactionResponse.From(transaction));
        }
        catch (TransactionInputException ex) { return BadRequest(ex.Message); }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.ForeignKeyViolation })
        { return Conflict("An account or category changed. Reload the form and try again."); }
    }

    private bool TryUserId(out int id) => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out id);
}
