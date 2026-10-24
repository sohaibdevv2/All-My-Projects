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
    [Authorize]    public class SkillsController : ControllerBase
    {
        private readonly SkillSnapContext _context;
        private readonly IMemoryCache _cache;
        private const string SKILLS_CACHE_KEY = "all_skills";
        private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(10);

        public SkillsController(SkillSnapContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }        [HttpGet]
        public async Task<ActionResult<IEnumerable<Skill>>> GetSkills()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            var cacheKey = $"{SKILLS_CACHE_KEY}_{userId}";
            
            // Try to get from cache first
            if (_cache.TryGetValue(cacheKey, out List<Skill>? cachedSkills))
            {
                return cachedSkills!;
            }            // If not in cache, get from database with optimized query (filter by user)
            var skills = await _context.Skills
                .AsNoTracking() // Performance optimization for read-only queries
                .Where(s => s.PortfolioUserId == userId) // Filter by current user
                .OrderBy(s => s.Name) // Add consistent ordering by name
                .ToListAsync();            // Store in cache
            _cache.Set(cacheKey, skills, _cacheExpiration);

            return Ok(skills);
        }        [HttpGet("{id}")]
        public async Task<ActionResult<Skill>> GetSkill(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            // Cache individual skills by ID and user
            string cacheKey = $"skill_{id}_{userId}";
            
            if (_cache.TryGetValue(cacheKey, out Skill? cachedSkill))
            {
                return cachedSkill!;
            }            var skill = await _context.Skills
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id && s.PortfolioUserId == userId);

            if (skill == null)
            {
                return NotFound();
            }

            // Cache the individual skill
            _cache.Set(cacheKey, skill, _cacheExpiration);

            return skill;
        }        [HttpPost]
        public async Task<ActionResult<Skill>> AddSkill(Skill skill)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            skill.PortfolioUserId = userId; // Ensure the skill belongs to the current user
            
            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();            // Invalidate cache when data changes
            InvalidateUserCache(userId);

            return CreatedAtAction("GetSkill", new { id = skill.Id }, skill);
        }        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkill(int id, Skill skill)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            if (id != skill.Id)
            {
                return BadRequest();
            }

            // Ensure the skill belongs to the current user
            var existingSkill = await _context.Skills.FindAsync(id);
            if (existingSkill == null || existingSkill.PortfolioUserId != userId)
            {
                return NotFound();
            }

            skill.PortfolioUserId = userId; // Ensure user can't change ownership
            _context.Entry(existingSkill).CurrentValues.SetValues(skill);

            try
            {
                await _context.SaveChangesAsync();
                
                // Invalidate cache when data changes
                InvalidateUserCache(userId);
                _cache.Remove($"skill_{id}_{userId}");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SkillExists(id))
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
        public async Task<IActionResult> DeleteSkill(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0)
            {
                return Unauthorized();
            }

            var skill = await _context.Skills.FindAsync(id);
            if (skill == null || skill.PortfolioUserId != userId)
            {
                return NotFound();
            }

            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();

            // Invalidate cache when data changes
            InvalidateUserCache(userId);
            _cache.Remove($"skill_{id}_{userId}");

            return NoContent();
        }

        private void InvalidateUserCache(int userId)
        {
            _cache.Remove($"{SKILLS_CACHE_KEY}_{userId}");
        }

        private bool SkillExists(int id)
        {
            return _context.Skills.Any(e => e.Id == id);
        }
    }
}
