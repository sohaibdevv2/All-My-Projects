using Microsoft.JSInterop;
using SkillSnap.Client.Models.Auth;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace SkillSnap.Client.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task LogoutAsync();
        Task<UserInfo?> GetCurrentUserAsync();
        Task<bool> IsAuthenticatedAsync();
        Task<string?> GetTokenAsync();
    }
    
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly IJSRuntime _jsRuntime;
        private const string TokenKey = "authToken";
        private const string UserKey = "userData";
        
        public AuthService(HttpClient httpClient, IJSRuntime jsRuntime)
        {
            _httpClient = httpClient;
            _jsRuntime = jsRuntime;
        }
        
        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            try
            {
                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("api/auth/login", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var authResponse = JsonSerializer.Deserialize<AuthResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    if (authResponse != null)
                    {
                        await StoreAuthDataAsync(authResponse);
                        SetAuthorizationHeader(authResponse.Token);
                    }
                    
                    return authResponse;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return null;
            }
        }
        
        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            try
            {
                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("api/auth/register", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var authResponse = JsonSerializer.Deserialize<AuthResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    if (authResponse != null)
                    {
                        await StoreAuthDataAsync(authResponse);
                        SetAuthorizationHeader(authResponse.Token);
                    }
                    
                    return authResponse;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                return null;
            }
        }
        
        public async Task LogoutAsync()
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", TokenKey);
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", UserKey);
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }
        
        public async Task<UserInfo?> GetCurrentUserAsync()
        {
            try
            {
                var userData = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", UserKey);
                if (string.IsNullOrEmpty(userData))
                    return null;
                    
                return JsonSerializer.Deserialize<UserInfo>(userData, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch
            {
                return null;
            }
        }
        
        public async Task<bool> IsAuthenticatedAsync()
        {
            var token = await GetTokenAsync();
            if (string.IsNullOrEmpty(token))
                return false;
                
            // TODO: Add token expiration check
            return true;
        }
        
        public async Task<string?> GetTokenAsync()
        {
            try
            {
                return await _jsRuntime.InvokeAsync<string>("localStorage.getItem", TokenKey);
            }
            catch
            {
                return null;
            }
        }
        
        private async Task StoreAuthDataAsync(AuthResponse authResponse)
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", TokenKey, authResponse.Token);
            
            var userInfo = new UserInfo
            {
                UserId = authResponse.UserId,
                Email = authResponse.Email,
                FirstName = authResponse.FirstName,
                LastName = authResponse.LastName,
                IsAuthenticated = true
            };
            
            var userJson = JsonSerializer.Serialize(userInfo);
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", UserKey, userJson);
        }
        
        private void SetAuthorizationHeader(string token)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }
        
        public async Task InitializeAsync()
        {
            var token = await GetTokenAsync();
            if (!string.IsNullOrEmpty(token))
            {
                SetAuthorizationHeader(token);
            }
        }
    }
}
