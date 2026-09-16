using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<FinancialAccount> FinancialAccounts => Set<FinancialAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FinancialAccount>()
            .Property(a => a.InitialBalance)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<FinancialAccount>()
            .Property(a => a.Balance)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<FinancialAccount>()
            .Property(a => a.Type)
            .HasConversion<string>();

        modelBuilder.Entity<FinancialAccount>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}