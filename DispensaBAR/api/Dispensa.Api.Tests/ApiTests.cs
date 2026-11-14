using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Dispensa.Api.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Dispensa.Api.Tests;

/// <summary>
/// Starts the real API in memory on a fresh SQLite file for each test,
/// with the demo account enabled (admin / admin).
/// </summary>
public class ApiTests : IDisposable
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower };

    private readonly string _dbFile = Path.Combine(Path.GetTempPath(), $"dispensa-test-{Guid.NewGuid()}.db");
    private readonly WebApplicationFactory<Program> _app;

    public ApiTests()
    {
        _app = new WebApplicationFactory<Program>().WithWebHostBuilder(b =>
        {
            b.UseSetting("ConnectionStrings:Sqlite", $"Data Source={_dbFile};Pooling=False");
            b.UseSetting("Demo:Enabled", "true");
            b.UseSetting("KeysPath", Path.Combine(Path.GetTempPath(), "dispensa-test-keys"));
        });
    }

    public void Dispose()
    {
        _app.Dispose();
        File.Delete(_dbFile);
    }

    // ---- Helpers ----

    /// <summary>A browser-like client: keeps the cookie and sends the CSRF header.</summary>
    private HttpClient NewClient()
    {
        var client = _app.CreateClient();
        client.DefaultRequestHeaders.Add("X-Requested-With", "dispensa");
        return client;
    }

    private static Task<HttpResponseMessage> Post(HttpClient c, string url, object body) => c.PostAsJsonAsync(url, body, Json);
    private static Task<HttpResponseMessage> Put(HttpClient c, string url, object body) => c.PutAsJsonAsync(url, body, Json);

    private static async Task<JsonElement> Read(HttpResponseMessage res) =>
        JsonDocument.Parse(await res.Content.ReadAsStringAsync()).RootElement;

    private async Task<HttpClient> LoginAs(string email, string password)
    {
        var client = NewClient();
        var res = await Post(client, "/api/auth/login", new { email, password });
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        return client;
    }

    /// <summary>Registers the first real user (becomes admin) and returns a logged-in client.</summary>
    private async Task<HttpClient> CreateAdmin()
    {
        await Post(NewClient(), "/api/auth/register", new { email = "boss@bar.it", password = "password-boss", display_name = "Boss" });
        return await LoginAs("boss@bar.it", "password-boss");
    }

    private async Task<HttpClient> CreateApprovedUser(HttpClient admin, string email = "mario@bar.it")
    {
        await Post(NewClient(), "/api/auth/register", new { email, password = "password-mario", display_name = "Mario" });
        var users = await Read(await admin.GetAsync("/api/users"));
        var id = users.EnumerateArray().First(u => u.GetProperty("email").GetString() == email).GetProperty("id").GetString();
        Assert.Equal(HttpStatusCode.NoContent, (await Post(admin, $"/api/users/{id}/approve", new { })).StatusCode);
        return await LoginAs(email, "password-mario");
    }

    private async Task<int> CreateProduct(HttpClient admin, string name, decimal quantity, int? categoryId = null, int? locationId = null)
    {
        var res = await Post(admin, "/api/products", new { name, quantity, category_id = categoryId, location_id = locationId });
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        return (await Read(res)).GetProperty("id").GetInt32();
    }

    // ---- Tests ----

    [Fact]
    public async Task First_user_is_admin_next_ones_wait_for_approval()
    {
        var admin = await CreateAdmin();
        var me = await Read(await admin.GetAsync("/api/auth/me"));
        Assert.Equal("admin", me.GetProperty("role").GetString());

        await Post(NewClient(), "/api/auth/register", new { email = "new@bar.it", password = "password-new" });
        var login = await Post(NewClient(), "/api/auth/login", new { email = "new@bar.it", password = "password-new" });
        Assert.Equal(HttpStatusCode.Forbidden, login.StatusCode);
    }

    [Fact]
    public async Task Wrong_password_is_rejected()
    {
        await CreateAdmin();
        var res = await Post(NewClient(), "/api/auth/login", new { email = "boss@bar.it", password = "wrong-password" });
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task Requests_without_the_csrf_header_are_blocked()
    {
        var client = _app.CreateClient(); // no X-Requested-With
        var res = await client.PostAsJsonAsync("/api/auth/login", new { email = "admin", password = "admin" });
        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task Not_logged_in_gets_401()
    {
        var res = await NewClient().GetAsync("/api/products");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task Movement_updates_quantity_and_writes_the_log()
    {
        var admin = await CreateAdmin();
        var mario = await CreateApprovedUser(admin);
        var id = await CreateProduct(admin, "Gin Mare", 2);

        var res = await Post(mario, $"/api/products/{id}/movement", new { action = "in", amount = 1.5 });
        Assert.Equal(3.5m, (await Read(res)).GetProperty("new_value").GetDecimal());

        // Can't go below zero
        res = await Post(mario, $"/api/products/{id}/movement", new { action = "out", amount = 10 });
        Assert.Equal(0m, (await Read(res)).GetProperty("new_value").GetDecimal());

        var history = await Read(await mario.GetAsync("/api/activity?mine=true"));
        Assert.Equal(2, history.GetArrayLength());
        var last = history[0];
        Assert.Equal("OUT", last.GetProperty("action").GetString());
        Assert.Equal("Mario", last.GetProperty("user_name").GetString());
        Assert.Equal(10m, last.GetProperty("details").GetProperty("amount").GetDecimal());
    }

    [Fact]
    public async Task Normal_user_cannot_do_admin_things()
    {
        var admin = await CreateAdmin();
        var mario = await CreateApprovedUser(admin);

        Assert.Equal(HttpStatusCode.Forbidden, (await Post(mario, "/api/products", new { name = "X", quantity = 1 })).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await mario.GetAsync("/api/users")).StatusCode);
    }

    [Fact]
    public async Task Normal_user_only_sees_own_history()
    {
        var admin = await CreateAdmin();
        var mario = await CreateApprovedUser(admin);
        var id = await CreateProduct(admin, "Rum", 5);

        await Post(admin, $"/api/products/{id}/movement", new { action = "out", amount = 1 });
        var marioHistory = await Read(await mario.GetAsync("/api/activity"));
        Assert.Equal(0, marioHistory.GetArrayLength());

        var adminHistory = await Read(await admin.GetAsync("/api/activity"));
        Assert.Equal(1, adminHistory.GetArrayLength());
    }

    [Fact]
    public async Task Demo_account_can_edit_products_but_not_users()
    {
        var realAdmin = await CreateAdmin();
        await Post(NewClient(), "/api/auth/register", new { email = "pending@bar.it", password = "password-pending" });

        var demo = await LoginAs("admin", "admin");
        await CreateProduct(demo, "Vermouth", 3);

        // The demo sees the users, but other people's emails are masked
        var users = await Read(await demo.GetAsync("/api/users"));
        var boss = users.EnumerateArray().First(u => u.GetProperty("display_name").GetString() == "Boss");
        Assert.Equal("b•••@bar.it", boss.GetProperty("email").GetString());
        var pending = users.EnumerateArray().First(u => u.GetProperty("role").GetString() == "pending");

        var bossId = boss.GetProperty("id").GetString();
        Assert.Equal(HttpStatusCode.Forbidden, (await Post(demo, $"/api/users/{pending.GetProperty("id").GetString()}/approve", new { })).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await demo.DeleteAsync($"/api/users/{bossId}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await Put(demo, $"/api/users/{bossId}/password", new { password = "hacked-123" })).StatusCode);
    }

    [Fact]
    public async Task Bulk_updates_by_name_and_creates_new_products()
    {
        var admin = await CreateAdmin();
        var location = await Read(await Post(admin, "/api/locations", new { name = "Bancone" }));
        var locationId = location.GetProperty("id").GetInt32();
        await CreateProduct(admin, "Campari", 1, locationId: locationId);

        var res = await Post(admin, "/api/products/bulk", new
        {
            location_id = locationId,
            entries = new[] { new { name = "campari", quantity = 4m }, new { name = "Aperol", quantity = 2m } }
        });
        var results = await Read(res);
        Assert.Equal("Aggiornato", results[0].GetProperty("action").GetString());
        Assert.Equal("Creato", results[1].GetProperty("action").GetString());

        var products = await Read(await admin.GetAsync($"/api/products?location_id={locationId}"));
        Assert.Equal(2, products.GetArrayLength());
        Assert.Equal(4m, products.EnumerateArray().First(p => p.GetProperty("name").GetString() == "Campari").GetProperty("quantity").GetDecimal());
    }

    [Fact]
    public async Task Search_returns_category_and_location_names()
    {
        var admin = await CreateAdmin();
        var cat = (await Read(await Post(admin, "/api/categories", new { name = "Gin" }))).GetProperty("id").GetInt32();
        var loc = (await Read(await Post(admin, "/api/locations", new { name = "Cantina" }))).GetProperty("id").GetInt32();
        await CreateProduct(admin, "Gin Mare", 2, cat, loc);
        await CreateProduct(admin, "Rum Pampero", 2);

        var found = await Read(await admin.GetAsync("/api/products?q=MARE"));
        Assert.Equal(1, found.GetArrayLength());
        Assert.Equal("Gin", found[0].GetProperty("categories").GetProperty("name").GetString());
        Assert.Equal("Cantina", found[0].GetProperty("locations").GetProperty("name").GetString());
    }

    [Fact]
    public async Task Discards_list_out_movements_with_category()
    {
        var admin = await CreateAdmin();
        var cat = (await Read(await Post(admin, "/api/categories", new { name = "Amari" }))).GetProperty("id").GetInt32();
        var id = await CreateProduct(admin, "Montenegro", 3, cat);
        await Post(admin, $"/api/products/{id}/movement", new { action = "out", amount = 1 });
        await Post(admin, $"/api/products/{id}/movement", new { action = "in", amount = 1 });

        var discards = await Read(await admin.GetAsync($"/api/activity/discards?category_id={cat}"));
        Assert.Equal(1, discards.GetArrayLength());
        Assert.Equal("Amari", discards[0].GetProperty("category_name").GetString());
    }

    [Fact]
    public async Task Passwords_imported_from_supabase_still_work()
    {
        // Supabase stores bcrypt hashes in the "$2a$10$..." format
        using (var scope = _app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDb>();
            db.Users.Add(new User
            {
                Email = "old@bar.it",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("old-password", BCrypt.Net.BCrypt.GenerateSalt(10, 'a')),
                Role = Roles.User,
            });
            await db.SaveChangesAsync();
        }

        await LoginAs("old@bar.it", "old-password");
    }
}
