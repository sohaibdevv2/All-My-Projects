using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSnap.Api.Models
{
    public class Skill
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Level { get; set; } = string.Empty;
        
        // Foreign key
        [ForeignKey("PortfolioUser")]
        public int PortfolioUserId { get; set; }
        
        // Navigation property
        public PortfolioUser? PortfolioUser { get; set; }
    }
}
