using Microsoft.Data.SqlClient;
using System.Data;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace SafeVault_FinalProject.Pages.Utilities
{
    public static class ValidationHelpers
    {
        private static string connectionString = @"";

        public static bool IsValidUserInput(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return false;
            }

            string pattern = @"^[a-zA-Z0-9@#$.]+$";

            return Regex.IsMatch(input, pattern);
        }

        public static Func<string, string, List<Claim>?> SecureLogin_test = SecureLogin;

        public static List<Claim>? SecureLogin(string username, string password)
        {
            const string query = "SELECT Username, IsAdmin, Password FROM Users WHERE Username = @username AND Password = @passwordHash";

            string passwordHash = HashPasswordSha256(password);

            using (var con = new SqlConnection(connectionString))
            {
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.Add("@username", SqlDbType.NVarChar, 50).Value = username;
                    cmd.Parameters.Add("@passwordHash", SqlDbType.VarChar, 100).Value = passwordHash;

                    try
                    {
                        con.Open();
                        var dr = cmd.ExecuteReader();

                        if (dr.Read())
                        {
                            var claims = new List<Claim>
                            {
                                new(ClaimTypes.Name, dr["Username"].ToString()),
                                new(ClaimTypes.Role, dr["IsAdmin"].ToString() == "True" ? "Admin" : "User"),
                                new("LastLogin", DateTime.UtcNow.ToString()),
                            };

                            con.Close();
                            return claims;
                        }
                        con.Close();
                        return null;
                    }
                    catch
                    {
                        return null;
                    }
                }
            }
        }

        public static bool UserExists(string username)
        {
            const string query = "SELECT COUNT(1) FROM Users WHERE Username = @username";

            using (var con = new SqlConnection(connectionString))
            {
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.Add("@username", SqlDbType.NVarChar, 50).Value = username;

                    con.Open();
                    int count = (int)cmd.ExecuteScalar();
                    con.Close();

                    return count > 0;
                }
            }
        }

        public static bool EmailExists(string email)
        {
            const string query = "SELECT COUNT(1) FROM Users WHERE Email = @email";

            using (var con = new SqlConnection(connectionString))
            {
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.Add("@email", SqlDbType.NVarChar, 100).Value = email;

                    con.Open();
                    int count = (int)cmd.ExecuteScalar();
                    con.Close();

                    return count > 0;
                }
            }
        }

        public static bool CreateUser(string username, string email, string password)
        {
            const string query = @"
                INSERT INTO Users (Username, Email, Password, IsAdmin)
                VALUES (@username, @email, @password, 0)";

            string hashedPassword = HashPasswordSha256(password);

            using (var con = new SqlConnection(connectionString))
            {
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.Add("@username", SqlDbType.NVarChar, 50).Value = username;
                    cmd.Parameters.Add("@email", SqlDbType.NVarChar, 100).Value = email;
                    cmd.Parameters.Add("@password", SqlDbType.VarChar, 100).Value = hashedPassword;

                    try
                    {
                        con.Open();
                        cmd.ExecuteNonQuery();
                        con.Close();
                        return true;
                    }
                    catch
                    {
                        return false;
                    }
                }
            }
        }

        public static string SanitizeInput(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            // Remove script tags
            input = Regex.Replace(input, "<script.*?>.*?</script>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);

            // Remove event handlers like onload=, onclick= etc.
            input = Regex.Replace(input, @"on\w+\s*=\s*[""'].*?[""']", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);

            // Remove javascript: or vbscript: protocols
            input = Regex.Replace(input, @"(javascript:|vbscript:)", "", RegexOptions.IgnoreCase);

            // Remove iframe, embed, and object tags
            input = Regex.Replace(input, @"<(iframe|embed|object).*?>.*?</\1>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);

            // Remove src attributes that contain scripts
            input = Regex.Replace(input, @"src\s*=\s*['""]?javascript:[^'""]*['""]?", "", RegexOptions.IgnoreCase);

            return input;
        }

        private static string HashPasswordSha256(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}