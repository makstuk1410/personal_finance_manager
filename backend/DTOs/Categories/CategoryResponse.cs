namespace backend.DTOs.Categories;

public class CategoryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public bool IsDefault { get; set; }
}
