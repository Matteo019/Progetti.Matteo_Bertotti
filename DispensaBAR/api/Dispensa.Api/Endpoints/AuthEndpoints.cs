using System.Security.Claims;
using Dispensa.Api.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

namespace Dispensa.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var auth = app.MapGroup("/api/auth");

        // Registration: the account stays "pending" until an admin approves it.
        // Exception: on an empty database the first account becomes admin.
        auth.MapPost("/register", async (RegisterRequest req, AppDb db) =>
        {
            var email = req.Email.Trim().ToLowerInvariant();
            if (!email.Contains('@'))
                return Error("Email non valida.");
            if (req.Password.Length < 8)
                return Error("La password deve avere almeno 8 caratteri.");
            if (await db.Users.AnyAsync(u => u.Email == email))
                return Error("Email già registrata.", 409);

            var isFirstUser = !await db.Users.AnyAsync(u => !u.IsDemo); // the demo account doesn't count
            db.Users.Add(new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                DisplayName = req.DisplayName?.Trim(),
                Role = isFirstUser ? Roles.Admin : Roles.Pending,
                ApprovedAt = isFirstUser ? DateTime.UtcNow : null,
            });
            await db.SaveChangesAsync();
            return Results.Created();
        }).RequireRateLimiting("auth");

        auth.MapPost("/login", async (LoginRequest req, AppDb db, HttpContext http) =>
        {
            var email = req.Email.Trim().ToLowerInvariant();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Error("Email o password non corretti.", 401);
            if (user.Role == Roles.Pending)
                return Error("Il tuo account è in attesa di approvazione dall'amministratore.", 403);

            // The cookie only stores the user id: role and approval are re-read from the DB on every request
            var identity = new ClaimsIdentity(
                [new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())],
                CookieAuthenticationDefaults.AuthenticationScheme);
            await http.SignInAsync(new ClaimsPrincipal(identity));

            return Results.Ok(ProfileDto.From(user));
        }).RequireRateLimiting("auth");

        auth.MapPost("/logout", async (HttpContext http) =>
        {
            await http.SignOutAsync();
            return Results.NoContent();
        });

        auth.MapGet("/me", (HttpContext http) => Results.Ok(ProfileDto.From(http.CurrentUser())))
            .AddEndpointFilter(RequireUser);

        // Lets the login page show "try it with admin / admin" when the demo account is on
        auth.MapGet("/demo", (IConfiguration config) =>
            config.GetValue<bool>("Demo:Enabled")
                ? Results.Ok(new { username = config["Demo:Username"] ?? "admin", password = config["Demo:Password"] ?? "admin" })
                : Results.NotFound());
    }

    // ---- Shared helpers used by all endpoint files ----

    public static IResult Error(string message, int status = 400) =>
        Results.Json(new { error = message }, statusCode: status);

    /// <summary>The logged-in user, loaded by the RequireUser/RequireAdmin filters.</summary>
    public static User CurrentUser(this HttpContext http) => (User)http.Items["user"]!;

    /// <summary>Endpoint filter: logged in and approved (role user or admin).</summary>
    public static async ValueTask<object?> RequireUser(EndpointFilterInvocationContext ctx, EndpointFilterDelegate next)
    {
        var user = await LoadUser(ctx.HttpContext);
        if (user == null) return Error("Non autenticato.", 401);
        if (user.Role == Roles.Pending) return Error("Account in attesa di approvazione.", 403);

        ctx.HttpContext.Items["user"] = user;
        return await next(ctx);
    }

    /// <summary>Endpoint filter: logged in as admin.</summary>
    public static async ValueTask<object?> RequireAdmin(EndpointFilterInvocationContext ctx, EndpointFilterDelegate next)
    {
        var user = await LoadUser(ctx.HttpContext);
        if (user == null) return Error("Non autenticato.", 401);
        if (user.Role != Roles.Admin) return Error("Serve un account amministratore.", 403);

        ctx.HttpContext.Items["user"] = user;
        return await next(ctx);
    }

    private static async Task<User?> LoadUser(HttpContext http)
    {
        var id = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(id, out var userId)) return null;

        var db = http.RequestServices.GetRequiredService<AppDb>();
        return await db.Users.FindAsync(userId);
    }
}
