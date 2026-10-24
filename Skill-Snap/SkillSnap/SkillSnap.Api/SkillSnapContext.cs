using Microsoft.EntityFrameworkCore;
using SkillSnap.Api.Models;

namespace SkillSnap.Api
{
    public class SkillSnapContext : DbContext
    {
        public SkillSnapContext(DbContextOptions<SkillSnapContext> options) : base(options) { }
        
        public DbSet<PortfolioUser> PortfolioUsers { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Skill> Skills { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure relationships
            modelBuilder.Entity<Project>()
                .HasOne(p => p.PortfolioUser)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.PortfolioUserId);
                
            modelBuilder.Entity<Skill>()
                .HasOne(s => s.PortfolioUser)
                .WithMany(u => u.Skills)
                .HasForeignKey(s => s.PortfolioUserId);
        }
    }
}
