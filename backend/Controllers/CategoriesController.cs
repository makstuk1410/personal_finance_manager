using System.Security.Claims;
using backend.Data;
using backend.DTOs.Categories;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var categories = await AvailableCategories(userId)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryResponse
            {
                Id = c.Id, Name = c.Name, IsDefault = c.IsDefault
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCategory(int id)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var category = await AvailableCategories(userId).FirstOrDefaultAsync(c => c.Id == id);
        return category == null ? NotFound() : Ok(ToResponse(category));
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory(CategoryRequest request)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var name = request.Name.Trim();
        var normalizedName = name.ToUpperInvariant();
        if (await NameExists(userId, normalizedName))
            return Conflict("A custom category with this name already exists.");

        var category = new Category
        {
            UserId = userId,
            Name = name,
            NormalizedName = normalizedName
        };
        _context.Categories.Add(category);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (IsDuplicateName(ex))
        {
            // The unique index also protects concurrent requests.
            return Conflict("A custom category with this name already exists.");
        }

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, ToResponse(category));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, CategoryRequest request)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var category = await AvailableCategories(userId).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound();
        if (category.IsDefault) return StatusCode(StatusCodes.Status403Forbidden,
            "Default categories cannot be modified.");

        var name = request.Name.Trim();
        var normalizedName = name.ToUpperInvariant();
        if (await NameExists(userId, normalizedName, id))
            return Conflict("A custom category with this name already exists.");

        category.Name = name;
        category.NormalizedName = normalizedName;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (IsDuplicateName(ex))
        {
            return Conflict("A custom category with this name already exists.");
        }
        catch (DbUpdateConcurrencyException)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var category = await AvailableCategories(userId).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound();
        if (category.IsDefault) return StatusCode(StatusCodes.Status403Forbidden,
            "Default categories cannot be deleted.");

        _context.Categories.Remove(category);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return NotFound();
        }

        catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.ForeignKeyViolation })
        {
            return Conflict("This category is used by a transaction and cannot be deleted.");
        }

        return NoContent();
    }

    private IQueryable<Category> AvailableCategories(int userId) =>
        _context.Categories.Where(c => c.IsDefault || c.UserId == userId);

    private Task<bool> NameExists(int userId, string normalizedName, int? exceptId = null) =>
        _context.Categories.AnyAsync(c => c.UserId == userId &&
            c.NormalizedName == normalizedName && (!exceptId.HasValue || c.Id != exceptId.Value));

    private bool TryGetUserId(out int userId) =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);

    private static bool IsDuplicateName(DbUpdateException exception) =>
        exception.InnerException is PostgresException
        {
            SqlState: PostgresErrorCodes.UniqueViolation,
            ConstraintName: "IX_Categories_UserId_NormalizedName"
        };

    private static CategoryResponse ToResponse(Category category) => new()
    {
        Id = category.Id, Name = category.Name, IsDefault = category.IsDefault
    };
}
