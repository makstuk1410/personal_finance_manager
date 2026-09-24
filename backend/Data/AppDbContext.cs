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
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<ExternalLogin> ExternalLogins => Set<ExternalLogin>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ExternalLogin>(entity =>
        {
            entity.Property(login => login.Provider).HasMaxLength(50).IsRequired();
            entity.Property(login => login.ProviderSubjectId).HasMaxLength(200).IsRequired();
            entity.HasIndex(login => new { login.Provider, login.ProviderSubjectId }).IsUnique();
            entity.HasOne(login => login.User)
                .WithMany(user => user.ExternalLogins)
                .HasForeignKey(login => login.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        var transaction = modelBuilder.Entity<Transaction>();
        transaction.Property(t => t.Amount).HasColumnType("numeric(18,2)");
        transaction.Property(t => t.Type).HasConversion<string>();
        transaction.Property(t => t.Description).HasMaxLength(500);
        transaction.HasOne<User>().WithMany().HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.Restrict);
        transaction.HasOne<FinancialAccount>().WithMany().HasForeignKey(t => t.SourceAccountId).OnDelete(DeleteBehavior.Restrict);
        transaction.HasOne<FinancialAccount>().WithMany().HasForeignKey(t => t.DestinationAccountId).OnDelete(DeleteBehavior.Restrict);
        transaction.HasOne<Category>().WithMany().HasForeignKey(t => t.CategoryId).OnDelete(DeleteBehavior.Restrict);
        transaction.HasIndex(t => new { t.UserId, t.Date });
        transaction.ToTable("Transactions", table =>
        {
            table.HasCheckConstraint("CK_Transactions_Amount", "\"Amount\" > 0");
            table.HasCheckConstraint("CK_Transactions_Shape", """
                ("Type" = 'Income' AND "SourceAccountId" IS NULL AND "DestinationAccountId" IS NOT NULL)
                OR ("Type" = 'Expense' AND "SourceAccountId" IS NOT NULL AND "DestinationAccountId" IS NULL AND "CategoryId" IS NOT NULL)
                OR ("Type" = 'Transfer' AND "SourceAccountId" IS NOT NULL AND "DestinationAccountId" IS NOT NULL
                    AND "SourceAccountId" <> "DestinationAccountId" AND "CategoryId" IS NULL)
                """);
        });

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
