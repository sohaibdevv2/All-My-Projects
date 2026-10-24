using System.ComponentModel.DataAnnotations;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// In-memory data store


app.Use(async (context, next) =>
{
    var method = context.Request.Method;
    var path = context.Request.Path;

    await next();

    var statusCode = context.Response.StatusCode;
    Console.WriteLine($"[{DateTime.UtcNow}] {method} {path} => {statusCode}");
});

app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var errorResponse = new { error = "Internal server error." };
        var json = JsonSerializer.Serialize(errorResponse);
        await context.Response.WriteAsync(json);

        Console.Error.WriteLine($"Unhandled Exception: {ex.Message}");
    }
});

app.Use(async (context, next) =>
{
    var token = context.Request.Headers["Authorization"].FirstOrDefault();

    if (token != "Bearer secret-token-123")
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Unauthorized");
        return;
    }

    await next();
});

var users = new List<User>();

// GET all users
app.MapGet("/users", (string? department) =>
{
    var filtered = string.IsNullOrWhiteSpace(department)
        ? users
        : users.Where(u => u.Department.Equals(department, StringComparison.OrdinalIgnoreCase)).ToList();

    return Results.Ok(filtered);
});

// GET user by ID
app.MapGet("/users/{id}", (int id) =>
{
    var user = users.FirstOrDefault(u => u.Id == id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
});

app.MapPost("/users", (ILogger<Program> logger, User user) =>
{
    try
    {
        // Add user creation logic here...
        logger.LogInformation("User created: {Email}", user.Email);
        return Results.Created($"/users/{user.Id}", user);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error creating user");
        return Results.Problem("Internal server error");
    }
});

// PUT update a user
app.MapPut("/users/{id}", (int id, User updatedUser) =>
{
    var user = users.FirstOrDefault(u => u.Id == id);
    if (user is null) return Results.NotFound();

    user.Name = updatedUser.Name;
    user.Email = updatedUser.Email;
    user.Department = updatedUser.Department;
    user.Role = updatedUser.Role;

    return Results.Ok(user);
});

// DELETE remove a user
app.MapDelete("/users/{id}", (int id) =>
{
    var user = users.FirstOrDefault(u => u.Id == id);
    if (user is null) return Results.NotFound();

    users.Remove(user);
    return Results.NoContent();
});

app.Run();