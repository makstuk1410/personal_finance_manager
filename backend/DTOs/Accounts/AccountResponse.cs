using backend.Models;

namespace backend.DTOs.Accounts;

public class AccountResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public FinancialAccountType Type { get; set; }
    public decimal InitialBalance { get; set; }

    public decimal Balance { get; set; }

    public string Currency { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}