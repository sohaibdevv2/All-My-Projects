using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SkillSnap.Client;
using SkillSnap.Client.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure HttpClient with API base address
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5092/") });

// Register services
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<SkillService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Initialize auth service to set token if available
var authService = app.Services.GetRequiredService<IAuthService>();
if (authService is AuthService authServiceImpl)
{
    await authServiceImpl.InitializeAsync();
}

await app.RunAsync();
