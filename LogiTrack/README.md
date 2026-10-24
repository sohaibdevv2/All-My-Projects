# LogiTrack

LogiTrack is a modern inventory and order management API built with ASP.NET Core and Entity Framework Core. It is designed for secure, scalable, and efficient handling of inventory and order workflows, with robust authentication and authorization.

## Features
- **RESTful API** for inventory and order management
- **Authentication**: ASP.NET Core Identity with JWT Bearer tokens
- **Role-based Authorization**: Protect endpoints and restrict access to managers
- **In-memory Caching**: Fast inventory queries with cache rehydration
- **Session/Cart Support**: Orders can be associated with session IDs or user tokens
- **Database Persistence**: Uses SQLite for reliable data storage
- **Input Validation & Error Handling**: Ensures robust and secure API usage
- **Swagger/OpenAPI**: Built-in API documentation and testing

## System Architecture
- **Backend**: ASP.NET Core Web API
- **Database**: SQLite (via Entity Framework Core)
- **Authentication**: JWT Bearer tokens, ASP.NET Core Identity
- **Authorization**: Role-based, with [Authorize] and [Authorize(Roles = "Manager")] attributes
- **Caching**: IMemoryCache for inventory endpoints

## Getting Started
1. Clone the repository
2. Run `dotnet restore` to install dependencies
3. Run database migrations: `dotnet ef database update`
4. Start the API: `dotnet run`
5. Access Swagger UI at `https://localhost:<port>/swagger`

## Key Decisions
- Chose JWT for stateless, secure API authentication
- Used in-memory caching for performance on read-heavy endpoints
- Implemented role-based access for sensitive operations
- Designed for extensibility and production-readiness
