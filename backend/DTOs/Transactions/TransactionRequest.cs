using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Transactions;

public class TransactionRequest : IValidatableObject
{
    [Required, EnumDataType(typeof(TransactionType))]
    public TransactionType? Type { get; set; }
    [Range(typeof(decimal), "0.01", "9999999999999999.99")]
    public decimal Amount { get; set; }
    [Required]
    public DateOnly? Date { get; set; }
    [StringLength(500)]
    public string? Description { get; set; }
    public int? SourceAccountId { get; set; }
    public int? DestinationAccountId { get; set; }
    public int? CategoryId { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (decimal.Round(Amount, 2) != Amount)
            yield return new ValidationResult("Amount must have at most two decimal places.", new[] { nameof(Amount) });
        if (Type == TransactionType.Income && (SourceAccountId != null || DestinationAccountId == null))
            yield return new ValidationResult("Income requires only a destination account.");
        if (Type == TransactionType.Expense && (SourceAccountId == null || DestinationAccountId != null || CategoryId == null))
            yield return new ValidationResult("Expense requires a source account and category, with no destination account.");
        if (Type == TransactionType.Transfer && (SourceAccountId == null || DestinationAccountId == null ||
            SourceAccountId == DestinationAccountId || CategoryId != null))
            yield return new ValidationResult("Transfer requires two different accounts and no category.");
    }
}
