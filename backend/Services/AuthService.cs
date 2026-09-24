using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.DTOs.Auth;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<User> CreateUserAsync(string email, string password)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        var user = new User
        {
            Email = email,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, password);

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task CreateUserIfNotExistsAsync(
    string email,
    string password)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null)
        {
            return;
        }

        await CreateUserAsync(email, password);
    }

    public async Task<LoginResponse?> LoginAsync(
    string email,
    string password)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return null;
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password
        );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        var token = GenerateJwtToken(user);

        return new LoginResponse
        {
            Token = token
        };
    }

    public async Task<LoginResponse> LoginWithExternalProviderAsync(
        string provider,
        string providerSubjectId,
        string email)
    {
        var externalLogin = await _context.ExternalLogins
            .Include(login => login.User)
            .SingleOrDefaultAsync(login =>
                login.Provider == provider &&
                login.ProviderSubjectId == providerSubjectId);

        User user;

        if (externalLogin != null)
        {
            user = externalLogin.User;
        }
        else
        {
            user = await _context.Users.FirstOrDefaultAsync(candidate => candidate.Email == email)
                ?? new User
                {
                    Email = email,
                    PasswordHash = string.Empty,
                    CreatedAt = DateTime.UtcNow
                };

            if (user.Id == 0)
            {
                await _context.Users.AddAsync(user);
            }

            await _context.ExternalLogins.AddAsync(new ExternalLogin
            {
                User = user,
                Provider = provider,
                ProviderSubjectId = providerSubjectId
            });

            await _context.SaveChangesAsync();
        }

        return new LoginResponse
        {
            Token = GenerateJwtToken(user)
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key is not configured.");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}