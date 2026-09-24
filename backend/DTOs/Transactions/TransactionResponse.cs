using backend.Models;

namespace backend.DTOs.Transactions;

public class TransactionResponse
{
    public int Id { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }
    public string? Description { get; set; }
    public int? SourceAccountId { get; set; }
    public int? DestinationAccountId { get; set; }
    public int? CategoryId { get; set; }

    public static TransactionResponse From(Transaction transaction) => new()
    {
        Id = transaction.Id, Type = transaction.Type, Amount = transaction.Amount,
        Date = transaction.Date, Description = transaction.Description,
        SourceAccountId = transaction.SourceAccountId, DestinationAccountId = transaction.DestinationAccountId,
        CategoryId = transaction.CategoryId
    };
}
