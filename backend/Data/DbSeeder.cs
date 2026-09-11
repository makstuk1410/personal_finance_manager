using backend.Services;

namespace backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AuthService authService)
    {
        await authService.CreateUserIfNotExistsAsync(
            "test@example.com",
            "Test123!"
        );
    }
}