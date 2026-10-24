using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SafeVault_FinalProject.Pages.Models;
using SafeVault_FinalProject.Pages.Utilities;
using System.Security.Cryptography;
using System.Text;

namespace SafeVault_FinalProject.Pages
{
    public class RegisterModel : PageModel
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RegisterModel> _logger;

        [BindProperty]
        public RegisterInputModel Input { get; set; }

        public string ErrorMessage { get; set; }

        public RegisterModel(IConfiguration configuration, ILogger<RegisterModel> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public void OnGet()
        {
            ErrorMessage = "";
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            try
            {
                if (!ValidationHelpers.IsValidUserInput(Input.Username))
                {
                    ModelState.AddModelError(string.Empty, "Invalid username format.");
                    return Page();
                }

                if (ValidationHelpers.UserExists(Input.Username))
                {
                    ModelState.AddModelError(string.Empty, "Username already exists.");
                    return Page();
                }

                if (ValidationHelpers.EmailExists(Input.Email))
                {
                    ModelState.AddModelError(string.Empty, "Email already registered.");
                    return Page();
                }

                bool success = ValidationHelpers.CreateUser(Input.Username, Input.Email, Input.Password);

                if (success)
                {
                    _logger.LogInformation($"New user registered: {Input.Username}");
                    return RedirectToPage("/Login", new { message = "Registration successful. Please log in." });
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "An error occurred during registration. Please try again.");
                    return Page();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during registration for user {Input.Username}");
                ModelState.AddModelError(string.Empty, "An error occurred during registration. Please try again.");
                return Page();
            }
        }
    }
} 