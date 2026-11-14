using System.Text.Json.Nodes;
using Dispensa.Api.Data;

namespace Dispensa.Api;

// JSON uses snake_case (see Program.cs): the frontend keeps the same field names it had with Supabase.

// ---- Responses ----

public record ProfileDto(Guid Id, string Email, string? DisplayName, string Role, bool IsDemo, DateTime CreatedAt, DateTime? ApprovedAt)
{
    public static ProfileDto From(User u) => new(u.Id, u.Email, u.DisplayName, u.Role, u.IsDemo, u.CreatedAt, u.ApprovedAt);
}

public record NameDto(string Name);

// Same shape as Supabase's select('*, categories(name), locations(name)')
public record ProductDto(
    int Id, string Name, decimal Quantity, int? CategoryId, int? LocationId,
    string? Origin, string? Aroma, string? Description, DateTime CreatedAt,
    NameDto? Categories, NameDto? Locations)
{
    public static ProductDto From(Product p) => new(
        p.Id, p.Name, p.Quantity, p.CategoryId, p.LocationId,
        p.Origin, p.Aroma, p.Description, p.CreatedAt,
        p.Category == null ? null : new NameDto(p.Category.Name),
        p.Location == null ? null : new NameDto(p.Location.Name));
}

public record ActivityDto(
    long Id, Guid? UserId, string? UserName, int? ProductId, string? ProductName, string Action,
    decimal? PreviousValue, decimal? NewValue, JsonNode? Details, DateTime CreatedAt, string? CategoryName)
{
    public static ActivityDto From(ActivityLog a) => new(
        a.Id, a.UserId, a.UserName, a.ProductId, a.ProductName, a.Action,
        a.PreviousValue, a.NewValue,
        a.Details == null ? null : JsonNode.Parse(a.Details),
        a.CreatedAt,
        a.Product?.Category?.Name);
}

// ---- Requests ----

public record RegisterRequest(string Email, string Password, string? DisplayName);
public record LoginRequest(string Email, string Password);
public record RoleRequest(string Role);
public record PasswordRequest(string Password);
public record NameRequest(string Name);
public record ProductRequest(string Name, int? CategoryId, int? LocationId, decimal Quantity, string? Origin, string? Aroma, string? Description);
public record MovementRequest(string Action, decimal Amount);
public record BulkEntry(string Name, decimal Quantity);
public record BulkRequest(int LocationId, int? CategoryId, List<BulkEntry> Entries);
