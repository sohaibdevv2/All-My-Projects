using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSnap.Api.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        public string ImageUrl { get; set; } = string.Empty;
        
        // Foreign key
        [ForeignKey("PortfolioUser")]
        public int PortfolioUserId { get; set; }
        
        // Navigation property
        public PortfolioUser? PortfolioUser { get; set; }
    }
}
