using System.ComponentModel.DataAnnotations;
using backend.Models;
using backend.Validation;

namespace backend.DTOs.Accounts;

public class CreateAccountRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Required]
    public FinancialAccountType Type { get; set; }

    [Range(
        typeof(decimal),
        "-9999999999999999.99",
        "9999999999999999.99")]
    public decimal InitialBalance { get; set; }

    [Required]
    [StringLength(3)]
    [AllowedCurrency]
    public string Currency { get; set; } = null!;
}