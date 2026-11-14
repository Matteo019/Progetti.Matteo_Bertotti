using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Dispensa.Api.Data;

public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ActivityLog> ActivityLog => Set<ActivityLog>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Table and column names in snake_case, like the old Supabase tables (makes the data import easy)
        b.Entity<User>().ToTable("users").HasIndex(u => u.Email).IsUnique();
        b.Entity<Category>().ToTable("categories").HasIndex(c => c.Name).IsUnique();
        b.Entity<Location>().ToTable("locations").HasIndex(l => l.Name).IsUnique();

        b.Entity<Product>(e =>
        {
            e.ToTable("products");
            e.Property(p => p.Quantity).HasPrecision(12, 2);
            // Deleting a category/location leaves the product without it
            e.HasOne(p => p.Category).WithMany().HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(p => p.Location).WithMany().HasForeignKey(p => p.LocationId).OnDelete(DeleteBehavior.SetNull);
        });

        b.Entity<ActivityLog>(e =>
        {
            e.ToTable("activity_log");
            e.HasIndex(a => a.CreatedAt);
            e.Property(a => a.PreviousValue).HasPrecision(12, 2);
            e.Property(a => a.NewValue).HasPrecision(12, 2);
            // Deleting a product keeps its history (product_name stays in the log)
            e.HasOne(a => a.Product).WithMany().HasForeignKey(a => a.ProductId).OnDelete(DeleteBehavior.SetNull);
        });

        foreach (var entity in b.Model.GetEntityTypes())
            foreach (var property in entity.GetProperties())
                property.SetColumnName(ToSnakeCase(property.Name));
    }

    // Dates are always saved in UTC. SQLite forgets it when reading them back: mark them as UTC
    // so the JSON has the final "Z" and the browser shows the right local time.
    protected override void ConfigureConventions(ModelConfigurationBuilder c) =>
        c.Properties<DateTime>().HaveConversion<UtcConverter>();

    private class UtcConverter() : ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

    // "CreatedAt" -> "created_at"
    private static string ToSnakeCase(string name) =>
        string.Concat(name.Select((c, i) => i > 0 && char.IsUpper(c) ? "_" + char.ToLower(c) : char.ToLower(c).ToString()));
}
