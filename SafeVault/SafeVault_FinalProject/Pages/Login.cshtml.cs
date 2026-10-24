using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using SafeVault_FinalProject.Pages.Models;
using SafeVault_FinalProject.Pages.Utilities;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SafeVault_FinalProject.Pages
{
    public class LoginModel : PageModel
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<LoginModel> _logger;

        [BindProperty]
        public LoginInputModel Input { get; set; }

        public string ErrorMessage { get; set; }

        public LoginModel(IConfiguration configuration, ILogger<LoginModel> logger)
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

            if (!ValidationHelpers.IsValidUserInput(Input.Username))
            {
                ModelState.AddModelError(string.Empty, "Invalid username format.");
                return Page();
            }

            try
            {
                var claims = ValidationHelpers.SecureLogin(Input.Username, Input.Password);

                if (claims != null)
                {
                    var claimsIdentity = new ClaimsIdentity(
                        claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    _logger.LogInformation(claimsIdentity.ToString());

                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity));

                    _logger.LogInformation($"User {Input.Username} logged in successfully");


                    var roleClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
                    var role = roleClaim?.Value;
                    _logger.LogInformation($"{role}");

                    if (role == "Admin")
                    {
                        return RedirectToPage("/Dashboard_admin");
                    }

                    else if (role == "User")
                    {
                        return RedirectToPage("/Dashboard");
                    }

                    return RedirectToPage("/Index");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Invalid username or password.");
                    _logger.LogWarning($"Failed login attempt for user {Input.Username}");
                    return Page();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during login attempt for user {Input.Username}");
                ModelState.AddModelError(string.Empty, "An error occurred during login. Please try again.");
                return Page();
            }
        }
    }
}
