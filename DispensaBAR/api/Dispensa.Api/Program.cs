using System.Text.Json;
using System.Threading.RateLimiting;
using Dispensa.Api.Data;
using Dispensa.Api.Endpoints;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ---- Database: PostgreSQL on the server, a SQLite file for local development and tests ----
var postgres = config.GetConnectionString("Postgres");
builder.Services.AddDbContext<AppDb>(options =>
{
    if (!string.IsNullOrEmpty(postgres))
        options.UseNpgsql(postgres);
    else
        options.UseSqlite(config.GetConnectionString("Sqlite") ?? "Data Source=dispensa-dev.db");
});

// ---- JSON in snake_case (category_id, display_name...) like the old Supabase API ----
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower);

// ---- Login with an HttpOnly cookie ----
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =>
    {
        o.Cookie.Name = "dispensa_session";
        o.Cookie.HttpOnly = true;                                // not readable from JavaScript
        o.Cookie.SameSite = SameSiteMode.Lax;
        // On the server (HTTPS via Cloudflare) SecureCookie=true: the cookie travels only over HTTPS
        o.Cookie.SecurePolicy = config.GetValue<bool>("SecureCookie") ? CookieSecurePolicy.Always : CookieSecurePolicy.SameAsRequest;
        o.ExpireTimeSpan = TimeSpan.FromDays(14);
        o.SlidingExpiration = true;
        // It's an API: answer 401/403 instead of redirecting to a login page
        o.Events.OnRedirectToLogin = ctx => { ctx.Response.StatusCode = 401; return Task.CompletedTask; };
        o.Events.OnRedirectToAccessDenied = ctx => { ctx.Response.StatusCode = 403; return Task.CompletedTask; };
    });
builder.Services.AddAuthorization();

// Keys that sign the cookie: saved on disk so a container restart doesn't log everyone out
builder.Services.AddDataProtection()
    .SetApplicationName("dispensa")
    .PersistKeysToFileSystem(new DirectoryInfo(config["KeysPath"] ?? "keys"));

// ---- Max 10 login/registration attempts per minute per IP ----
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = 429;
    o.AddPolicy("auth", http => RateLimitPartition.GetFixedWindowLimiter(
        // Behind Cloudflare the real client IP is in CF-Connecting-IP
        http.Request.Headers["CF-Connecting-IP"].FirstOrDefault() ?? http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1) }));
});

var app = builder.Build();

// ---- Create the tables (first start) and the demo account ----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    db.Database.EnsureCreated();
    await DemoAccount.SyncAsync(db, config);
}

// CSRF protection: every change (POST/PUT/DELETE) must carry the X-Requested-With header.
// Another site can't add custom headers to a request towards us, so it can't act with the user's cookie.
app.Use(async (http, next) =>
{
    if (!HttpMethods.IsGet(http.Request.Method) && http.Request.Headers["X-Requested-With"] != "dispensa")
    {
        http.Response.StatusCode = 403;
        await http.Response.WriteAsJsonAsync(new { error = "Richiesta non valida." });
        return;
    }
    await next();
});

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapCatalogEndpoints();
app.MapProductEndpoints();
app.MapActivityEndpoints();

app.Run();

public partial class Program; // lets the tests start the app
