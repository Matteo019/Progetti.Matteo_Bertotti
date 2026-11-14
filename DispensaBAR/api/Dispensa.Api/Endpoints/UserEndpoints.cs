using Dispensa.Api.Data;
using Microsoft.EntityFrameworkCore;
using static Dispensa.Api.Endpoints.AuthEndpoints;

namespace Dispensa.Api.Endpoints;

// User management (admin only). The demo account can look but not change anything here.
public static class UserEndpoints
{
    private const string DemoBlocked = "Account demo: la gestione utenti è disattivata.";

    public static void MapUserEndpoints(this WebApplication app)
    {
        var users = app.MapGroup("/api/users").AddEndpointFilter(RequireAdmin);

        users.MapGet("/", async (AppDb db, HttpContext http) =>
        {
            var me = http.CurrentUser();
            var list = await db.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();

            // On the public demo, other people's emails are masked (someone may sign up with a real one)
            return list.Select(u => ProfileDto.From(u) with
            {
                Email = me.IsDemo && u.Id != me.Id ? MaskEmail(u.Email) : u.Email
            });
        });

        users.MapPost("/{id:guid}/approve", async (Guid id, AppDb db, HttpContext http) =>
        {
            if (http.CurrentUser().IsDemo) return Error(DemoBlocked, 403);

            var user = await db.Users.FindAsync(id);
            if (user == null) return Results.NotFound();

            user.Role = Roles.User;
            user.ApprovedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        users.MapPut("/{id:guid}/role", async (Guid id, RoleRequest req, AppDb db, HttpContext http) =>
        {
            var me = http.CurrentUser();
            if (me.IsDemo) return Error(DemoBlocked, 403);
            if (req.Role != Roles.User && req.Role != Roles.Admin) return Error("Ruolo non valido.");
            if (id == me.Id) return Error("Non puoi cambiare il tuo ruolo.");

            var user = await db.Users.FindAsync(id);
            if (user == null) return Results.NotFound();

            user.Role = req.Role;
            user.ApprovedAt ??= DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        // Replaces the old "forgot password" email: the admin sets a new password
        users.MapPut("/{id:guid}/password", async (Guid id, PasswordRequest req, AppDb db, HttpContext http) =>
        {
            if (http.CurrentUser().IsDemo) return Error(DemoBlocked, 403);
            if (req.Password.Length < 8) return Error("La password deve avere almeno 8 caratteri.");

            var user = await db.Users.FindAsync(id);
            if (user == null) return Results.NotFound();
            if (user.IsDemo) return Error("La password dell'account demo si cambia dalla configurazione del server.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        // Deny a pending request or delete a user
        users.MapDelete("/{id:guid}", async (Guid id, AppDb db, HttpContext http) =>
        {
            var me = http.CurrentUser();
            if (me.IsDemo) return Error(DemoBlocked, 403);
            if (id == me.Id) return Error("Non puoi eliminare il tuo account.");

            var user = await db.Users.FindAsync(id);
            if (user == null) return Results.NotFound();
            if (user.IsDemo) return Error("L'account demo si disattiva dalla configurazione del server.");

            db.Users.Remove(user);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    // "mario.rossi@gmail.com" -> "m•••@gmail.com"
    private static string MaskEmail(string email)
    {
        var at = email.IndexOf('@');
        return at <= 0 ? "•••" : email[0] + "•••" + email[at..];
    }
}
