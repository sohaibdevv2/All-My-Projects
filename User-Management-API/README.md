# 🧠 User Management API – .NET 9 Capstone Project

This is a backend capstone project developed using **ASP.NET Core (.NET 9)** as part of the Microsoft Foundational Program. 
The project simulates a real-world internal API for **TechHive Solutions**, aimed at efficiently managing user records across HR and IT departments.

## Tech Stack

- ASP.NET Core 9 (Minimal APIs)
- C#
- Swagger (OpenAPI)
- Postman & .http (for testing)
- Middleware (custom-built for logging, error handling, authentication)

## Features

- **CRUD Endpoints**: Create, retrieve, update, and delete users
- **Token-Based Authentication**: Secures endpoints using bearer tokens
- **Validation**: Ensures proper input formats (e.g. valid emails)
- **Logging Middleware**: Logs HTTP method, path, and response status
- **Error-Handling Middleware**: Catches unhandled exceptions and returns standardized JSON errors


## Testing Instructions

Use `.http` files or Postman to run:

- `GET /users` – fetch all users
- `POST /users` – create user (with token)
- Edge cases: Invalid input, nonexistent user ID, missing token

Test coverage includes:
- Input validation
- Authentication flow
- Middleware interaction and reliability

## Learning Outcomes

- Applied .NET 9 minimal hosting model
- Designed and implemented middleware pipelines
- Practiced secure API design and automated testing
- Explored AI-assisted development using Microsoft Copilot for scaffolding, bug fixes, and performance optimization

## Author

**Sohaib Malik** –  
Capstone completed under Microsoft mentorship with focus on scalable backend design and iterative problem solving.

