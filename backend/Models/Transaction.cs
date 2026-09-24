namespace backend.Models;

public enum TransactionType { Income, Expense, Transfer }

public class Transaction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? SourceAccountId { get; set; }
    public int? DestinationAccountId { get; set; }
    public int? CategoryId { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public DateOnly Date { get; set; }
    public string? Description { get; set; }
}
