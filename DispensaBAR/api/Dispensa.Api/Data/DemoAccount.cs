using Microsoft.EntityFrameworkCore;

namespace Dispensa.Api.Data;

/// <summary>
/// Shared test account for portfolio visitors (default admin / admin).
/// Configuration (environment variables on the server):
///   Demo__Enabled=true   Demo__Username=admin   Demo__Password=admin
/// It is an admin for products, categories and locations, but it can't manage users
/// (see UserEndpoints). With Demo__Enabled=false it can no longer log in.
/// </summary>
public static class DemoAccount
{
    public static async Task SyncAsync(AppDb db, IConfiguration config)
    {
        var enabled = config.GetValue<bool>("Demo:Enabled");
        var username = (config["Demo:Username"] ?? "admin").ToLowerInvariant();
        var password = config["Demo:Password"] ?? "admin";

        var demo = await db.Users.FirstOrDefaultAsync(u => u.IsDemo);

        if (!enabled)
        {
            // Disabled: block the login by putting it back to "pending"
            if (demo != null) demo.Role = Roles.Pending;
            await db.SaveChangesAsync();
            return;
        }

        if (demo == null)
        {
            demo = new User { IsDemo = true, CreatedAt = DateTime.UtcNow };
            db.Users.Add(demo);
        }

        // Always reset to the configured values at startup
        demo.Email = username;
        demo.DisplayName = "Demo";
        demo.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        demo.Role = Roles.Admin;
        demo.ApprovedAt ??= DateTime.UtcNow;
        await db.SaveChangesAsync();
    }
}
