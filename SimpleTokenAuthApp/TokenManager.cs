using System;
using System.Text;

namespace SimpleTokenAuthApp
{
    public class TokenManager
    {
        public string GenerateToken(string username)
        {
            var expiry = DateTime.UtcNow.AddMinutes(30).ToString();
            string tokenData = $"{username}:{expiry}";
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenData));
        }
    }
}