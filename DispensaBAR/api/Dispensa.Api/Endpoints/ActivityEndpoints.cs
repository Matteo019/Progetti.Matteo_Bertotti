using Dispensa.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Dispensa.Api.Endpoints.AuthEndpoints;

namespace Dispensa.Api.Endpoints;

public static class ActivityEndpoints
{
    public static void MapActivityEndpoints(this WebApplication app)
    {
        // History. Normal users only ever see their own; admins see everything
        // and can filter by time range: GET /api/activity?from=...&to=...&limit=100
        app.MapGet("/api/activity", async (AppDb db, HttpContext http, bool? mine, DateTimeOffset? from, DateTimeOffset? to, int? limit) =>
        {
            var user = http.CurrentUser();
            var query = db.ActivityLog.AsQueryable();

            if (mine == true || user.Role != Roles.Admin)
                query = query.Where(a => a.UserId == user.Id);
            if (from != null)
                query = query.Where(a => a.CreatedAt >= from.Value.UtcDateTime);
            if (to != null)
                query = query.Where(a => a.CreatedAt < to.Value.UtcDateTime);

            var items = await query
                .OrderByDescending(a => a.CreatedAt)
                .Take(Math.Clamp(limit ?? 100, 1, 500))
                .ToListAsync();
            return items.Select(ActivityDto.From);
        }).AddEndpointFilter(RequireUser);

        // "Discards" view: bottles taken out (OUT) in the last N days, with the product's category
        app.MapGet("/api/activity/discards", async (AppDb db, int? days, [FromQuery(Name = "category_id")] int? categoryId) =>
        {
            var since = DateTime.UtcNow.AddDays(-(days ?? 30));
            var query = db.ActivityLog
                .Include(a => a.Product).ThenInclude(p => p!.Category)
                .Where(a => a.Action == "OUT" && a.CreatedAt >= since && a.Product != null);

            if (categoryId != null)
                query = query.Where(a => a.Product!.CategoryId == categoryId);

            var items = await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
            return items.Select(ActivityDto.From);
        }).AddEndpointFilter(RequireUser);
    }
}
