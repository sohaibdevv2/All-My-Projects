using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using SkillSnap.Api.Models;
using System.Security.Claims;

namespace SkillSnap.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]    public class ProjectsController : ControllerBase
    {
        private readonly SkillSnapContext _context;
        private readonly IMemoryCache _cache;
        private const string PROJECTS_CACHE_KEY = "all_projects";
        private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(10);

        public ProjectsController(SkillSnapContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            var cacheKey = $"{PROJECTS_CACHE_KEY}_{userId}";
            
            // Try to get from cache first
            if (_cache.TryGetValue(cacheKey, out List<Project>? cachedProjects))
            {
                return cachedProjects!;
            }            // If not in cache, get from database with optimized query (filter by user)
            var projects = await _context.Projects
                .AsNoTracking() // Performance optimization for read-only queries
                .Where(p => p.PortfolioUserId == userId) // Filter by current user
                .OrderBy(p => p.Title) // Add consistent ordering
                .ToListAsync();

            // Store in cache
            _cache.Set(cacheKey, projects, _cacheExpiration);

            return projects;
        }        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            // Cache individual projects by ID and user
            string cacheKey = $"project_{id}_{userId}";
            
            if (_cache.TryGetValue(cacheKey, out Project? cachedProject))
            {
                return cachedProject!;
            }

            var project = await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id && p.PortfolioUserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            // Cache the individual project
            _cache.Set(cacheKey, project, _cacheExpiration);

            return project;
        }        [HttpPost]
        public async Task<ActionResult<Project>> AddProject(Project project)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            project.PortfolioUserId = userId; // Ensure the project belongs to the current user
            
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Invalidate cache when data changes
            InvalidateUserCache(userId);

            return CreatedAtAction("GetProject", new { id = project.Id }, project);
        }        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project project)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            if (id != project.Id)
            {
                return BadRequest();
            }

            // Ensure the project belongs to the current user
            var existingProject = await _context.Projects.FindAsync(id);
            if (existingProject == null || existingProject.PortfolioUserId != userId)
            {
                return NotFound();
            }

            project.PortfolioUserId = userId; // Ensure user can't change ownership
            _context.Entry(existingProject).CurrentValues.SetValues(project);

            try
            {
                await _context.SaveChangesAsync();
                
                // Invalidate cache when data changes
                InvalidateUserCache(userId);
                _cache.Remove($"project_{id}_{userId}");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            var project = await _context.Projects.FindAsync(id);
            if (project == null || project.PortfolioUserId != userId)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            // Invalidate cache when data changes
            InvalidateUserCache(userId);
            _cache.Remove($"project_{id}_{userId}");

            return NoContent();
        }

        private void InvalidateUserCache(int userId)
        {
            _cache.Remove($"{PROJECTS_CACHE_KEY}_{userId}");
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}
