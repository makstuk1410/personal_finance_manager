namespace backend.DTOs.Auth;

public class RegisterRequest
{
    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string PasswordConfirmation { get; set; } = null!;
}