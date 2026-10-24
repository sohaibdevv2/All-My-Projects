using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using SafeVault_FinalProject.Pages;
using SafeVault_FinalProject.Pages.Models;
using SafeVault_FinalProject.Pages.Utilities;
using System.Security.Claims;
using Xunit;

namespace SafeVault_FinalProject.Tests
{
    public class LoginModelTests
    {

        [Fact]
        public async Task OnPostAsync_InvalidModelState_ReturnsPage()
        {
            // Arrange
            var logger = new Mock<ILogger<LoginModel>>();
            var config = new Mock<IConfiguration>();
            var model = new LoginModel(config.Object, logger.Object);
            model.ModelState.AddModelError("Input.Username", "Required");

            // Act
            var result = await model.OnPostAsync();

            // Assert
            Assert.IsType<PageResult>(result);
        }

        [Fact]
        public async Task OnPostAsync_InvalidUsernameFormat_ReturnsPageWithError()
        {
            // Arrange
            var logger = new Mock<ILogger<LoginModel>>();
            var config = new Mock<IConfiguration>();
            var model = new LoginModel(config.Object, logger.Object)
            {
                Input = new LoginInputModel { Username = "invalid user!", Password = "password123" }
            };

            // Act
            var result = await model.OnPostAsync();

            // Assert
            Assert.IsType<PageResult>(result);
            Assert.True(model.ModelState.ErrorCount > 0);
        }

        [Fact]
        public async Task OnPostAsync_InvalidCredentials_ReturnsPageWithError()
        {
            // Arrange
            var logger = new Mock<ILogger<LoginModel>>();
            var config = new Mock<IConfiguration>();
            var model = new LoginModel(config.Object, logger.Object)
            {
                Input = new LoginInputModel { Username = "wronguser", Password = "wrongpass" }
            };

            // Mock SecureLogin to return null
            ValidationHelpers.SecureLogin_test = (u, p) => null;

            // Act
            var result = await model.OnPostAsync();

            // Assert
            Assert.IsType<PageResult>(result);
            Assert.True(model.ModelState.ErrorCount > 0);
        }

    }
}
