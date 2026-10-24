using System.ComponentModel.DataAnnotations;

namespace SafeVault_FinalProject.Pages.Models
{
    public class LoginInputModel
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        [RegularExpression(@"^[a-zA-Z0-9@#$.]+$", ErrorMessage = "Username can only contain letters, numbers, and @#$.")]
        [Display(Name = "Username")]
        // Consider a more specific regex for username if it has strict character rules
        // For example: [RegularExpression(@"^[a-zA-Z0-9_.-]+$", ErrorMessage = "Username contains invalid characters.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long")]
        //[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).*$", 
        //    ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me")]
        public bool RememberMe { get; set; }
    }
}
