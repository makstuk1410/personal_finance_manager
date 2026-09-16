using System.Security.Claims;
using backend.Data;
using backend.DTOs.Accounts;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AccountsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAccount(
        CreateAccountRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var account = new FinancialAccount
        {
            UserId = userId,
            Name = request.Name,
            Type = request.Type,
            InitialBalance = request.InitialBalance,
            Balance = request.InitialBalance,
            Currency = request.Currency,
            CreatedAt = DateTime.UtcNow
        };

        _context.FinancialAccounts.Add(account);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetAccount),
            new { id = account.Id },
            account);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccount(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var account = await _context.FinancialAccounts
            .Where(a =>
                a.Id == id &&
                a.UserId == userId)
            .Select(a => new AccountResponse
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type,
                InitialBalance = a.InitialBalance,
                Balance = a.Balance,
                Currency = a.Currency,
                CreatedAt = a.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (account == null)
        {
            return NotFound();
        }

        return Ok(account);
    }

    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var accounts = await _context.FinancialAccounts
            .Where(a => a.UserId == userId)
            .Select(a => new AccountResponse
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type,
                InitialBalance = a.InitialBalance,
                Balance = a.Balance,
                Currency = a.Currency,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        return Ok(accounts);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccount(
    int id,
    UpdateAccountRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var account = await _context.FinancialAccounts
            .FirstOrDefaultAsync(a =>
                a.Id == id &&
                a.UserId == userId);

        if (account == null)
        {
            return NotFound();
        }

        account.Name = request.Name;
        account.Type = request.Type;
        account.Currency = request.Currency;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var account = await _context.FinancialAccounts
            .FirstOrDefaultAsync(a =>
                a.Id == id &&
                a.UserId == userId);

        if (account == null)
        {
            return NotFound();
        }

        _context.FinancialAccounts.Remove(account);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}