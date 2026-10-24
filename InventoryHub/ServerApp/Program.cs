// Define models to represent the data. This provides type safety and better readability.

var builder = WebApplication.CreateBuilder(args);

// Configure Cross-Origin Resource Sharing (CORS).
// This is necessary for the API to accept requests from a different origin,
// such as a separate Blazor or JavaScript frontend.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // For development purposes, allow any origin, method, and header.
        // In a production environment, this should be restricted to specific origins for security.
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Enable the CORS middleware. This must be called before any endpoints
// that require CORS functionality.
app.UseCors();

// Define a GET endpoint to return a list of products.
// This endpoint returns a hardcoded list of strongly-typed Product objects.
app.MapGet("/api/products", () =>
{
    // Return an array of the Product model, which is automatically
    // serialized to JSON by the framework.
    return new[]
    {
        new Product { Id = 1, Name = "Laptop", Price = 1200.50, Stock = 25 },
        new Product { Id = 2, Name = "Headphones", Price = 50.00, Stock = 100 }
    };
});

// Start the web application and listen for incoming HTTP requests.
// This is a blocking call that runs until the application is shut down.
app.Run();
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Price { get; set; }
    public int Stock { get; set; }
}