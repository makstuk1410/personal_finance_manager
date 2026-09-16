using System.ComponentModel.DataAnnotations;
using backend.Models;
using backend.Validation;

namespace backend.DTOs.Accounts;

public class UpdateAccountRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Required]
    public FinancialAccountType Type { get; set; }

    [Required]
    [StringLength(3)]
    [AllowedCurrency]
    public string Currency { get; set; } = null!;
}