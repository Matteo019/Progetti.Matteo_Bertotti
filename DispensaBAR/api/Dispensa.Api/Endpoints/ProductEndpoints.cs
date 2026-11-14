using System.Text.Json;
using Dispensa.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Dispensa.Api.Endpoints.AuthEndpoints;

namespace Dispensa.Api.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        // List / search: GET /api/products?q=gin&category_id=1&location_id=2&limit=20
        app.MapGet("/api/products", async (
            AppDb db,
            string? q,
            [FromQuery(Name = "category_id")] int? categoryId,
            [FromQuery(Name = "location_id")] int? locationId,
            int? limit) =>
        {
            var query = db.Products.Include(p => p.Category).Include(p => p.Location).AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(p => p.Name.ToLower().Contains(q.Trim().ToLower()));
            if (categoryId != null)
                query = query.Where(p => p.CategoryId == categoryId);
            if (locationId != null)
                query = query.Where(p => p.LocationId == locationId);

            query = query.OrderBy(p => p.Name);
            if (limit != null)
                query = query.Take(limit.Value);

            var products = await query.ToListAsync();
            return products.Select(ProductDto.From);
        }).AddEndpointFilter(RequireUser);

        // Load / unload bottles. The server computes the new quantity and writes the log,
        // so the history can't be faked from the browser.
        app.MapPost("/api/products/{id:int}/movement", async (int id, MovementRequest req, AppDb db, HttpContext http) =>
        {
            if (req.Action != "in" && req.Action != "out") return Error("Azione non valida.");
            if (req.Amount <= 0) return Error("La quantità deve essere maggiore di zero.");

            var product = await db.Products.Include(p => p.Category).Include(p => p.Location)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return Results.NotFound();

            var previous = product.Quantity;
            var newQuantity = req.Action == "in" ? previous + req.Amount : Math.Max(0, previous - req.Amount);
            product.Quantity = Math.Round(newQuantity, 1);
            product.UpdatedAt = DateTime.UtcNow;

            db.ActivityLog.Add(NewLog(http.CurrentUser(), product, req.Action.ToUpper(), previous,
                new { amount = req.Amount }));
            await db.SaveChangesAsync(); // product + log saved together

            return Results.Ok(new { product = ProductDto.From(product), previous_value = previous, new_value = product.Quantity });
        }).AddEndpointFilter(RequireUser);

        // ---- Admin ----

        app.MapPost("/api/products", async (ProductRequest req, AppDb db) =>
        {
            if (string.IsNullOrWhiteSpace(req.Name)) return Error("Il nome è obbligatorio.");

            var product = new Product();
            CopyFields(req, product);
            db.Products.Add(product);
            await db.SaveChangesAsync();
            return Results.Ok(ProductDto.From(product));
        }).AddEndpointFilter(RequireAdmin);

        app.MapPut("/api/products/{id:int}", async (int id, ProductRequest req, AppDb db, HttpContext http) =>
        {
            if (string.IsNullOrWhiteSpace(req.Name)) return Error("Il nome è obbligatorio.");

            var product = await db.Products.FindAsync(id);
            if (product == null) return Results.NotFound();

            var previous = product.Quantity;
            CopyFields(req, product);
            product.UpdatedAt = DateTime.UtcNow;

            // A quantity changed by hand from the admin panel also ends up in the history
            if (previous != product.Quantity)
                db.ActivityLog.Add(NewLog(http.CurrentUser(), product, "ADMIN_EDIT", previous, null));

            await db.SaveChangesAsync();
            return Results.Ok(ProductDto.From(product));
        }).AddEndpointFilter(RequireAdmin);

        app.MapDelete("/api/products/{id:int}", async (int id, AppDb db) =>
        {
            var product = await db.Products.FindAsync(id);
            if (product == null) return Results.NotFound();

            db.Products.Remove(product);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).AddEndpointFilter(RequireAdmin);

        // Bulk entry: for each line, update the product with the same name in that location, or create it
        app.MapPost("/api/products/bulk", async (BulkRequest req, AppDb db, HttpContext http) =>
        {
            var user = http.CurrentUser();
            var existing = await db.Products.Where(p => p.LocationId == req.LocationId).ToListAsync();
            var results = new List<object>();

            foreach (var entry in req.Entries)
            {
                var name = entry.Name.Trim();
                if (name == "") continue;

                var product = existing.FirstOrDefault(p => p.Name.Trim().Equals(name, StringComparison.OrdinalIgnoreCase));
                if (product != null)
                {
                    var previous = product.Quantity;
                    product.Quantity = entry.Quantity;
                    product.UpdatedAt = DateTime.UtcNow;
                    db.ActivityLog.Add(NewLog(user, product, "BULK_UPDATE", previous, new { bulk = true }));
                    results.Add(new { name, success = true, action = "Aggiornato" });
                }
                else
                {
                    product = new Product { Name = name, Quantity = entry.Quantity, LocationId = req.LocationId, CategoryId = req.CategoryId };
                    db.Products.Add(product);
                    existing.Add(product); // a repeated name in the same list updates this one
                    db.ActivityLog.Add(NewLog(user, product, "BULK_INSERT", 0, new { bulk = true }));
                    results.Add(new { name, success = true, action = "Creato" });
                }
            }

            await db.SaveChangesAsync(); // all or nothing
            return Results.Ok(results);
        }).AddEndpointFilter(RequireAdmin);
    }

    private static void CopyFields(ProductRequest req, Product product)
    {
        product.Name = req.Name.Trim();
        product.Quantity = req.Quantity;
        product.CategoryId = req.CategoryId;
        product.LocationId = req.LocationId;
        product.Origin = Clean(req.Origin);
        product.Aroma = Clean(req.Aroma);
        product.Description = Clean(req.Description);
    }

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static ActivityLog NewLog(User user, Product product, string action, decimal previous, object? details) => new()
    {
        UserId = user.Id,
        UserName = user.DisplayName ?? user.Email,
        Product = product,
        ProductName = product.Name,
        Action = action,
        PreviousValue = previous,
        NewValue = product.Quantity,
        Details = details == null ? null : JsonSerializer.Serialize(details),
    };
}
