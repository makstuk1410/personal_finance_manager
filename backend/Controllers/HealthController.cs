using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;


namespace backend.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("database")]
    public async Task<IActionResult> CheckDatabase()
    {
        var connectionString =
            _context.Database.GetConnectionString();

        try
        {
            await using var connection = new NpgsqlConnection(connectionString);

            await connection.OpenAsync();

            return Ok(new
            {
                connected = true,
                state = connection.State.ToString()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                connected = false,
                error = ex.Message,
                type = ex.GetType().FullName
            });
        }
    }
}