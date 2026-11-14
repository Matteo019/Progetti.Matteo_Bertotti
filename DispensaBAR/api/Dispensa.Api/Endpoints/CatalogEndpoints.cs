using Dispensa.Api.Data;
using Microsoft.EntityFrameworkCore;
using static Dispensa.Api.Endpoints.AuthEndpoints;

namespace Dispensa.Api.Endpoints;

// Categories and locations: simple name lists. Everyone can read them, only admins change them.
public static class CatalogEndpoints
{
    public static void MapCatalogEndpoints(this WebApplication app)
    {
        // ---- Categories ----
        app.MapGet("/api/categories", async (AppDb db) =>
            await db.Categories.OrderBy(c => c.Name).ToListAsync())
            .AddEndpointFilter(RequireUser);

        app.MapPost("/api/categories", async (NameRequest req, AppDb db) =>
        {
            var name = req.Name.Trim();
            if (name == "") return Error("Il nome è obbligatorio.");
            if (await db.Categories.AnyAsync(c => c.Name == name)) return Error("Categoria già esistente.", 409);

            var category = new Category { Name = name };
            db.Categories.Add(category);
            await db.SaveChangesAsync();
            return Results.Ok(category);
        }).AddEndpointFilter(RequireAdmin);

        app.MapDelete("/api/categories/{id:int}", async (int id, AppDb db) =>
        {
            var category = await db.Categories.FindAsync(id);
            if (category == null) return Results.NotFound();

            db.Categories.Remove(category);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).AddEndpointFilter(RequireAdmin);

        // ---- Locations ----
        app.MapGet("/api/locations", async (AppDb db) =>
            await db.Locations.OrderBy(l => l.Name).ToListAsync())
            .AddEndpointFilter(RequireUser);

        app.MapPost("/api/locations", async (NameRequest req, AppDb db) =>
        {
            var name = req.Name.Trim();
            if (name == "") return Error("Il nome è obbligatorio.");
            if (await db.Locations.AnyAsync(l => l.Name == name)) return Error("Posizione già esistente.", 409);

            var location = new Location { Name = name };
            db.Locations.Add(location);
            await db.SaveChangesAsync();
            return Results.Ok(location);
        }).AddEndpointFilter(RequireAdmin);

        app.MapDelete("/api/locations/{id:int}", async (int id, AppDb db) =>
        {
            var location = await db.Locations.FindAsync(id);
            if (location == null) return Results.NotFound();

            db.Locations.Remove(location);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).AddEndpointFilter(RequireAdmin);
    }
}
