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

    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var category = modelBuilder.Entity<Category>();
        category.Property(c => c.Name).HasMaxLength(100).IsRequired();
        category.Property(c => c.NormalizedName).HasMaxLength(100).IsRequired();
        category.HasIndex(c => new { c.UserId, c.NormalizedName })
            .IsUnique();
        category.HasIndex(c => c.NormalizedName)
            .IsUnique()
            .HasFilter("\"IsDefault\"");
        category.HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        category.ToTable("Categories", table => table.HasCheckConstraint(
            "CK_Categories_Owner",
            "(\"IsDefault\" AND \"UserId\" IS NULL) OR (NOT \"IsDefault\" AND \"UserId\" IS NOT NULL)"));

        // Stable negative IDs leave the identity sequence available for custom categories.
        var defaultNames = new[]
        {
            "Food", "Transport", "Housing", "Entertainment", "Shopping",
            "Health", "Education", "Subscriptions", "Other"
        };
        category.HasData(defaultNames.Select((name, index) => new Category
        {
            Id = -(index + 1),
            Name = name,
            NormalizedName = name.ToUpperInvariant(),
            IsDefault = true
        }));

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
