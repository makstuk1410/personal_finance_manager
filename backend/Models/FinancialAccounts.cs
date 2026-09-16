namespace backend.Models;

public class FinancialAccount
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public FinancialAccountType Type { get; set; }

    public decimal InitialBalance { get; set; }

    public decimal Balance { get; set; }

    public string Currency { get; set; } = null!;

    public User User { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}