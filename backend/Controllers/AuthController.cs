using System.Security.Claims;
using backend.DTOs.Auth;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            if (request.Password != request.PasswordConfirmation)
            {
                return BadRequest("Passwords do not match.");
            }

            var user = await _authService.CreateUserAsync(
                request.Email,
                request.Password
            );

            return StatusCode(201, new
            {
                user.Id,
                user.Email,
                user.CreatedAt
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.LoginAsync(
            request.Email,
            request.Password
        );

        if (result == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(result);
    }


    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Ok(new
        {
            UserId = userId
        });
    }
}