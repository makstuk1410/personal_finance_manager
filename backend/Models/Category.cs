namespace backend.Models;

public class Category
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Name { get; set; } = null!;
    public string NormalizedName { get; set; } = null!;
    public bool IsDefault { get; set; }
    public User? User { get; set; }
}
