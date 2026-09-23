using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Categories;

public class CategoryRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;
}
