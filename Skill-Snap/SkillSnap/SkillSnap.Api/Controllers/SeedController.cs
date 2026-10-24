using Microsoft.AspNetCore.Mvc;
using SkillSnap.Api.Models;
using System.Security.Cryptography;
using System.Text;

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
                Email = "jordan@skillsnap.com",
                FirstName = "Jordan",
                LastName = "Developer",
                PasswordHash = HashPassword("password123"),
                Bio = "Full-stack developer passionate about learning new tech.",
                ProfileImageUrl = "https://example.com/images/jordan.png",
                CreatedAt = DateTime.UtcNow,
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
            };            _context.PortfolioUsers.Add(user);
            _context.SaveChanges();

            return Ok("Sample data inserted.");
        }
        
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "SkillSnapSalt"));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
