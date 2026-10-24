namespace SafeVault_FinalProject.Tests;

using SafeVault_FinalProject.Pages.Utilities;
using Xunit;

public class IsValidUserInputTests
{
    [Theory]
    [InlineData("username123", true)]
    [InlineData("user@name", true)]
    [InlineData("user#name$", true)]
    [InlineData("user.name", true)]
    [InlineData("user_name", false)]   // underscore not allowed
    [InlineData("user name", false)]   // space not allowed
    [InlineData("user!", false)]       // exclamation mark not allowed
    [InlineData("", false)]            // empty string
    [InlineData(null, false)]          // null input
    public void IsValidUserInput_ReturnsExpectedResult(string input, bool expected)
    {
        // Act
        var result = ValidationHelpers.IsValidUserInput(input);

        // Assert
        Assert.Equal(expected, result);
    }
}

public class SanitizeInput
{
    [Theory]
    [InlineData(null, null)]
    [InlineData("", "")]
    [InlineData("Hello World", "Hello World")]
    [InlineData("<script>alert('XSS')</script>", "")]
    [InlineData("<div onclick=\"alert()\">Click me</div>", "<div >Click me</div>")]
    [InlineData("<a href=\"javascript:alert('XSS')\">link</a>", "<a href=\"alert('XSS')\">link</a>")]
    [InlineData("<iframe src=\"bad.html\"></iframe>", "")]
    [InlineData("<embed src=\"malicious.swf\"></embed>", "")]
    [InlineData("<object data=\"bad\"></object>", "")]
    [InlineData("<div onload='evil()'>safe</div>", "<div >safe</div>")]
    public void SanitizeInput_RemovesMaliciousContent(string input, string expected)
    {
        // Act
        var result = ValidationHelpers.SanitizeInput(input);

        // Assert
        Assert.Equal(expected, result);
    }
}

