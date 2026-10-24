using LogiTrack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace LogiTrack.Data
{
    public class LogiTrackContext : IdentityDbContext<ApplicationUser>
    {
        // Parameterless constructor for EF Core tooling
        public LogiTrackContext() { }

        public LogiTrackContext(DbContextOptions<LogiTrackContext> options)
            : base(options) { }

        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<Order> Orders { get; set; }
    }
}
