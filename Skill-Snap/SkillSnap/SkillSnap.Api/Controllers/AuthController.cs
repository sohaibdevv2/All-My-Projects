using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSnap.Api.Models;
using SkillSnap.Api.Models.Auth;
using SkillSnap.Api.Services;
using System.Security.Cryptography;
using System.Text;

namespace SkillSnap.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SkillSnapContext _context;
        private readonly IJwtService _jwtService;
        
        public AuthController(SkillSnapContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _context.PortfolioUsers
                    .FirstOrDefaultAsync(u => u.Email == request.Email);
                    
                if (existingUser != null)
                {
                    return BadRequest("User with this email already exists");
                }
                
                // Create new user
                var user = new PortfolioUser
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PasswordHash = HashPassword(request.Password),
                    CreatedAt = DateTime.UtcNow
                };
                
                _context.PortfolioUsers.Add(user);
                await _context.SaveChangesAsync();
                
                // Generate JWT token
                var token = _jwtService.GenerateToken(
                    user.Id.ToString(), 
                    user.Email, 
                    user.FirstName, 
                    user.LastName
                );
                
                return Ok(new AuthResponse
                {
                    Token = token,
                    UserId = user.Id.ToString(),
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            try
            {
                var user = await _context.PortfolioUsers
                    .FirstOrDefaultAsync(u => u.Email == request.Email);
                    
                if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
                {
                    return Unauthorized("Invalid email or password");
                }
                
                var token = _jwtService.GenerateToken(
                    user.Id.ToString(), 
                    user.Email, 
                    user.FirstName, 
                    user.LastName
                );
                
                return Ok(new AuthResponse
                {
                    Token = token,
                    UserId = user.Id.ToString(),
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "SkillSnapSalt"));
            return Convert.ToBase64String(hashedBytes);
        }
        
        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}
