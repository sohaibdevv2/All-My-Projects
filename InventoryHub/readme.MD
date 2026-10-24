## Full Stack Integration Capstone Project

# Project Reflection

GitHub Copilot was a key assistant in this project, helping with everything from code generation to debugging.

***

## How Copilot Helped

* **Integration and Code Generation**: Copilot quickly generated boilerplate code for the Blazor `HttpClient` calls, including `GetFromJsonAsync` and `try-catch` blocks, which saved a lot of time.
* **Debugging**: When a "NetworkError" occurred, Copilot's analysis helped diagnose the issue as a misconfigured **CORS policy** or an incorrect **`HttpClient` base address**. It provided the exact code needed to fix the problem in both the frontend and backend `Program.cs` files.
* **Code Quality**: It suggested using **strongly-typed models** (`Product` and `Category`) over anonymous types, which improved the API's maintainability. It also optimized the Blazor code by replacing two redundant API calls with a single, efficient `GetFromJsonAsync` call.

***

## Challenges and Lessons

The main challenge was ensuring that Copilot's suggestions fit the larger project context. I learned that simply accepting its code isn't enough; you have to understand the full-stack architecture to properly implement its suggestions. This taught me to use Copilot as a tool for **synthesis and critical evaluation**, not just code generation. By doing so, I was able to build a more robust and well-structured application.