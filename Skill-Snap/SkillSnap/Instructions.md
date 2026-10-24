# Activity Introduction

You’re building SkillSnap, your own full-stack portfolio and project tracker. In this part of the capstone, you will scaffold the foundation of your application. You’ll define the data models that support user profiles, projects, and skills. You’ll also configure your API and EF Core context, and set up placeholder Blazor components for your layout.

In this activity, you will:

- Create data models and configure the database
- Build the API structure
- Design static layout components in Blazor
- Use Microsoft Copilot to scaffold and optimize code

This is the first of five activities. In future parts, you’ll add interactivity, security, performance enhancements, and Copilot-assisted debugging.

Activity Instructions
Step 1: Set Up Your Full-Stack Project

- Create a new solution folder called SkillSnap
    - Create a new web API called SkillSnap.Api
    - Create the Blazor WebAssembly project called SkillSnap.Client
- Add both  SkillSnap.Api and SkillSnap.Client to your solution:

Step 2: Create the Data Models

In a SkillSnap.Api/Models folder, add three classes:

PortfolioUser.cs

- Id (int)
- Name (string)
- Bio (string)
- ProfileImageUrl (string)
- Navigation: List< Project >, List< Skill >

Project.cs

- Id (int)
- Title (string)
- Description (string)
- ImageUrl (string)
- PortfolioUserId (foreign key)

Skill.cs

- Id (int)
- Name (string)
- Level (string)
- PortfolioUserId (foreign key)

Use [Key] and [ForeignKey] attributes as needed. Use Copilot to help generate model code and relationships.

Step 3: Configure EF Core

In SkillSnap.Api, create SkillSnapContext.cs:

```
public class SkillSnapContext : DbContext
{
    public SkillSnapContext(DbContextOptions<SkillSnapContext> options) : base(options) { }
    public DbSet<PortfolioUser> PortfolioUsers { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Skill> Skills { get; set; }
}
```

In Program.cs, register the context and configure SQLite:

```
dotnet ef database update
```

Step 4: Populate the Database with Sample Data

Now that your database is set up, add some sample data you can use to test your components. 

1. Add a New Controller to Seed Data
In the SkillSnap.Api/Controllers folder, create a new file called SeedController.cs. Paste in the following code:

```
using Microsoft.AspNetCore.Mvc;
using SkillSnap.Api.Models;
namespace SkillSnap.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly SkillSnapContext _context;
        public SeedController(SkillSnapContext context)
        {
            _context = context;
        }
        [HttpPost]
        public IActionResult Seed()
        {
            if (_context.PortfolioUsers.Any())
            {
                return BadRequest("Sample data already exists.");
            }
            var user = new PortfolioUser
            {
                Name = "Jordan Developer",
                Bio = "Full-stack developer passionate about learning new tech.",
                ProfileImageUrl = "https://example.com/images/jordan.png",
                Projects = new List<Project>
                {
                    new Project { Title = "Task Tracker", Description = "Manage tasks effectively", ImageUrl = "https://example.com/images/task.png" },
                    new Project { Title = "Weather App", Description = "Forecast weather using APIs", ImageUrl = "https://example.com/images/weather.png" }
                },
                Skills = new List<Skill>
                {
                    new Skill { Name = "C#", Level = "Advanced" },
                    new Skill { Name = "Blazor", Level = "Intermediate" }
                }
            };
            _context.PortfolioUsers.Add(user);
            _context.SaveChanges();
            return Ok("Sample data inserted.");
        }
    }
}
```

2. Call the Endpoint to Insert Data
Start your API project, then make a POST request to this endpoint:

```
https://localhost:<your-port>/api/seed
```

You can use a browser extension like REST Client, Postman, or a command line tool like curl:

```
curl -X POST https://localhost:<your-port>/api/seed
```

Tip: Replace < your-port > with the actual port number shown in your terminal when the app runs.

You’ll get a confirmation message if the data is added successfully. If you try again later, it will return a message that the data already exists.

Step 5: Scaffold Static Blazor Layouts

In SkillSnap.Client, add placeholder components:

- ProfileCard.razor: Name, Bio, Profile Picture
- ProjectList.razor: Loop of dummy projects
- SkillTags.razor: Skills in tag-style list

Use Copilot to help scaffold each .razor component. These will be hooked to the API in the next activity.

# Activity Introduction

Now that your SkillSnap application has data models and placeholder components, it’s time to connect your front-end to the API. In this activity, you’ll build the CRUD routes in the API and link them to the Blazor components. You’ll use dependency injection to create services, send HTTP requests, and bind the results to the UI.

In this activity, you will:

- Build GET and POST endpoints for Projects and Skills
- Create Blazor services to fetch and send data
- Bind data to components using @code and @inject
- Use Copilot to help manage data flow and detect errors

This is the second of five activities. By the end of this part, your app will begin functioning as a real portfolio site.

Activity Instructions
Step 1: Create API Controllers

In the SkillSnap.Api/Controllers folder, create:

- ProjectsController.cs
- SkillsController.cs

Each controller should include:

- [HttpGet] to return all items
- [HttpPost] to add an item
- Use constructor injection for SkillSnapContext

Example prompt for Copilot assistance:

- “Write a controller for managing Project data with GET and POST.”

Step 2: Enable CORS in the API

In Program.cs, add:

```
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins("https://localhost:5001")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
app.UseCors("AllowClient");
```

This ensures the Blazor client can make requests to the API.

Step 3: Create Services in Blazor

In SkillSnap.Client/Services, add:

- ProjectService.cs
- SkillService.cs

Each service should use HttpClient to:

- GetProjectsAsync()
- AddProjectAsync(Project newProject)

Register them in Program.cs in the client project:

```
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<SkillService>();
```

Step 4: Connect Services to Components

In ProjectList.razor, add:

```
@inject ProjectService ProjectService
@code {
    private List<Project> projects;
    protected override async Task OnInitializedAsync()
    {
        projects = await ProjectService.GetProjectsAsync();
    }
}
```

Repeat for SkillTags.razor. Use placeholder buttons or forms for testing POST functionality.

# Activity Introduction

Now that SkillSnap is showing data, it’s time to secure your app. In this activity, you’ll implement authentication and authorization. You’ll build login and registration routes using ASP.NET Identity, secure sensitive API endpoints, and add login/logout functionality in the Blazor front end.

In this activity, you will:

- Configure ASP.NET Identity for user management
- Build registration and login APIs
- Use role-based authorization to restrict API access
- Implement login/logout functionality in Blazor
- Use Copilot to verify authentication logic

This is the third of five activities. By the end, only authenticated users will be able to modify content in your app.

Activity Instructions
Step 1: Add ASP.NET Identity to the API

Install Identity packages:

```
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

Create an ApplicationUser class inheriting from IdentityUser. Update SkillSnapContext:

```
public class SkillSnapContext : IdentityDbContext<ApplicationUser>
```

In Program.cs, register Identity:

```
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<SkillSnapContext>();
```

Run migrations:

```
dotnet ef migrations add AddIdentity
dotnet ef database update
```

Step 2: Create AuthController

In SkillSnap.Api/Controllers, create AuthController.cs. Add endpoints:

- [HttpPost] /api/auth/register – register new user
- [HttpPost] /api/auth/login – authenticate and return JWT

Use UserManager, SignInManager, and token generation logic.

Use Copilot prompts:

- “Generate ASP.NET Identity login controller that returns a JWT.”

- “Securely register a user using ASP.NET Identity.”

Step 3: Protect API Endpoints

Add [Authorize] to ProjectsController and SkillsController methods that modify data. Use:

[Authorize(Roles = "Admin")]

for routes requiring elevated privileges.

Step 4: Add Login/Logout to Blazor UI

In SkillSnap.Client, create:

- Login.razor
- Register.razor
- AuthService.cs to manage token storage and user state

Store token in local storage and attach it to API requests.

Use Copilot to help with:

- “Create Blazor login form with token storage.”
- “Persist user session across page reloads.”

Step 5: Test the Full Authentication Flow

- Register a user
- Log in and receive a token
- Use the token to access protected routes
- Attempt unauthorized requests and confirm they are blocked

# Activity Introduction

As your application grows, performance becomes critical. In this activity, you’ll implement caching in your API to reduce database load and enhance speed. You’ll also manage session state in the front end to improve user experience. You’ll use Copilot to find and apply optimizations throughout.

In this activity, you will:

- Implement in-memory caching in the API
- Optimize controller logic and reduce redundant queries
- Store user session or role information in Blazor state
- Use Copilot to guide caching and optimization decisions

This is the fourth of five activities. Your application will be smoother, faster, and better prepared for real-world use.

Activity Instructions
Step 1: Add In-Memory Caching to the API

In Program.cs, register the service:

builder.Services.AddMemoryCache();

In ProjectsController or SkillsController, use IMemoryCache to cache common queries:

```
public class ProjectsController : ControllerBase
{
    private readonly SkillSnapContext _context;
    private readonly IMemoryCache _cache;
    public ProjectsController(SkillSnapContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }
    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        if (!_cache.TryGetValue("projects", out List<Project> projects))
        {
            projects = await _context.Projects.ToListAsync();
            _cache.Set("projects", projects, TimeSpan.FromMinutes(5));
        }
        return Ok(projects);
    }
}
```

Use Copilot prompts:

- “Add in-memory caching to ASP.NET Core controller.”
- “Implement caching with expiration and fallback logic.”

Step 2: Optimize Queries and Controller Logic

In your API:

- Add .AsNoTracking() where updates aren’t required
- Use .Include() to reduce round-trips for related data

Prompt Copilot with:

- “Optimize EF Core controller queries for performance.”

Step 3: Manage State in Blazor Front End

In Program.cs, register Scoped state container services (e.g., UserSessionService).

Create a service class that stores:

- UserId
- Role
- Any current editing/project state

Inject it into components to persist user information across components without reloading.

Use Copilot to:

- “Create a Blazor state management service for logged-in user info.”

Step 4: Measure and Verify Improvements

- Use Stopwatch to measure request duration
- Manually test load time before and after changes
- Log cache hits vs. misses to confirm efficiency

# Activity Introduction

In this final step, you will complete the SkillSnap application by ensuring all core functionality works as intended. You’ll validate user flows, data updates, authentication, and performance enhancements. You’ll also refine your user experience and apply final Copilot-driven code improvements. This work will prepare your project for peer submission.

In this activity, you will:

- Test authentication and access controls
- Verify CRUD operations across the UI
- Confirm caching and state logic work as intended
- Refactor code with Copilot assistance
- Document your architecture and features for peer review

Activity Instructions
Step 1: Validate the Full Application Flow

- Start from registration/login and test user access
- Add, update, and delete projects or skills
- Confirm that only authenticated users can edit
- Check unauthorized actions are blocked

Use Copilot to validate routes:

- “Review secure endpoint logic in ASP.NET Core.”
- “Confirm Blazor token usage in HttpClient.”

Step 2: Verify Data Consistency and Caching

- Refresh data after CRUD operations
- Check if cached data updates as expected
- Log cache usage (hit/miss) in API for verification

Step 3: Review and Refactor with Copilot

Use Copilot to:

- Remove unused code and services
- Suggest naming or structure improvements
- Generate code comments or helper methods

Prompt examples:

- “Review this component for redundant logic.”
- “Suggest improvements for this Blazor service class.”

Step 4: Final UX Polishing

- Adjust layout, spacing, or font sizes in Blazor components
- Add placeholder images or sample data for readability
- Test the interface on desktop and mobile if possible