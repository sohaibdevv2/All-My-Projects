using LogiTrack.Data;
using LogiTrack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();

// Configure the database context with SQLite
builder.Services.AddDbContext<LogiTrackContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddAuthorization();

// Identity and password policy
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<LogiTrackContext>();


// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]))
    };
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Automatically apply any pending migrations at startup
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<LogiTrackContext>();
        dbContext.Database.Migrate();
    }
}


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Define API Endpoints
app.MapGet(
    "/inventory",
    async (LogiTrackContext db) =>
    {
        return await db.InventoryItems.ToListAsync();
    }
);

app.MapPost(
    "/inventory",
    async (InventoryItem item, LogiTrackContext db) =>
    {
        db.InventoryItems.Add(item);
        await db.SaveChangesAsync();
        return Results.Created($"/inventory/{item.Id}", item);
    }
);

// Delete inventory item
app.MapDelete(
    "/inventory/{id}",
    async (int id, LogiTrackContext db) =>
    {
        var item = await db.InventoryItems.FindAsync(id);
        if (item == null)
            return Results.NotFound();
        db.InventoryItems.Remove(item);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
);

// Get all orders
app.MapGet(
    "/orders",
    async (LogiTrackContext db) =>
    {
        return await db.Orders.Include(o => o.Items).ToListAsync();
    }
);

// Get order by id
app.MapGet(
    "/orders/{id}",
    async (int id, LogiTrackContext db) =>
    {
        var order = await db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.OrderId == id);
        return order is not null ? Results.Ok(order) : Results.NotFound();
    }
);

// Create order
app.MapPost(
    "/orders",
    async (Order order, LogiTrackContext db) =>
    {
        db.Orders.Add(order);
        await db.SaveChangesAsync();
        return Results.Created($"/orders/{order.OrderId}", order);
    }
);

// Delete order
app.MapDelete(
    "/orders/{id}",
    async (int id, LogiTrackContext db) =>
    {
        var order = await db.Orders.FindAsync(id);
        if (order == null)
            return Results.NotFound();
        db.Orders.Remove(order);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
);

app.Run();
