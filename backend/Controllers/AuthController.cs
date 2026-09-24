using System.Security.Claims;
using backend.DTOs.Auth;
using backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;

    public AuthController(
        AuthService authService,
        IMemoryCache cache,
        IConfiguration configuration)
    {
        _authService = authService;
        _cache = cache;
        _configuration = configuration;
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

    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        if (string.IsNullOrWhiteSpace(_configuration["OAuth:Google:ClientId"]) ||
            string.IsNullOrWhiteSpace(_configuration["OAuth:Google:ClientSecret"]))
        {
            return Problem(
                statusCode: StatusCodes.Status503ServiceUnavailable,
                title: "Google OAuth is not configured.",
                detail: "Set OAuth__Google__ClientId and OAuth__Google__ClientSecret before using Google login.");
        }

        var callbackUrl = Url.Action(nameof(GoogleCallback), "Auth");
        var properties = new AuthenticationProperties
        {
            RedirectUri = callbackUrl
        };

        return Challenge(properties, "Google");
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await HttpContext.AuthenticateAsync("External");
        await HttpContext.SignOutAsync("External");

        if (!result.Succeeded)
        {
            return Redirect(GetFrontendUrl("/login?oauthError=google_login_failed"));
        }

        var providerSubjectId = result.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = result.Principal.FindFirstValue(ClaimTypes.Email);

        if (string.IsNullOrWhiteSpace(providerSubjectId) || string.IsNullOrWhiteSpace(email))
        {
            return Redirect(GetFrontendUrl("/login?oauthError=google_email_required"));
        }

        var loginResponse = await _authService.LoginWithExternalProviderAsync(
            "google",
            providerSubjectId,
            email);

        var code = Guid.NewGuid().ToString("N");
        _cache.Set(code, loginResponse.Token, TimeSpan.FromMinutes(1));

        return Redirect(GetFrontendUrl($"/oauth-callback?code={code}"));
    }

    [HttpPost("oauth/exchange")]
    public IActionResult ExchangeOAuthCode([FromBody] OAuthCodeRequest request)
    {
        if (!_cache.TryGetValue(request.Code, out string? token) || token == null)
        {
            return Unauthorized("OAuth code is invalid or expired.");
        }

        _cache.Remove(request.Code);
        return Ok(new LoginResponse { Token = token });
    }

    private string GetFrontendUrl(string path)
    {
        var frontendUrl = _configuration["OAuth:FrontendUrl"] ?? "http://localhost:3000";
        return $"{frontendUrl.TrimEnd('/')}{path}";
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