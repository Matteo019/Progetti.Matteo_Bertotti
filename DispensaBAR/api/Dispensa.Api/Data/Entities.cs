namespace Dispensa.Api.Data;

public static class Roles
{
    public const string Pending = "pending"; // registered, waiting for an admin
    public const string User = "user";
    public const string Admin = "admin";
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string? DisplayName { get; set; }
    public string Role { get; set; } = Roles.Pending;
    public bool IsDemo { get; set; } // shared test account (admin/admin): can't manage users
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedAt { get; set; }
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Location
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Quantity { get; set; }
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
    public int? LocationId { get; set; }
    public Location? Location { get; set; }
    public string? Origin { get; set; }
    public string? Aroma { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class ActivityLog
{
    public long Id { get; set; }
    public Guid? UserId { get; set; }
    public string? UserName { get; set; }
    public int? ProductId { get; set; }
    public Product? Product { get; set; }
    public string? ProductName { get; set; }
    public string Action { get; set; } = ""; // IN, OUT, BULK_INSERT, BULK_UPDATE, ADMIN_EDIT
    public decimal? PreviousValue { get; set; }
    public decimal? NewValue { get; set; }
    public string? Details { get; set; } // JSON text, e.g. {"amount":1}
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
