using System.Net.Http.Json;
using SkillSnap.Client.Models;

namespace SkillSnap.Client.Services
{
    public class SkillService
    {
        private readonly HttpClient _httpClient;
        private const string ApiBaseUrl = "api/skills";

        public SkillService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Skill>> GetSkillsAsync()
        {
            try
            {
                var skills = await _httpClient.GetFromJsonAsync<List<Skill>>(ApiBaseUrl);
                return skills ?? new List<Skill>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching skills: {ex.Message}");
                return new List<Skill>();
            }
        }

        public async Task<Skill?> GetSkillAsync(int id)
        {
            try
            {
                return await _httpClient.GetFromJsonAsync<Skill>($"{ApiBaseUrl}/{id}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching skill {id}: {ex.Message}");
                return null;
            }
        }

        public async Task<Skill?> AddSkillAsync(Skill newSkill)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync(ApiBaseUrl, newSkill);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<Skill>();
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding skill: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> UpdateSkillAsync(int id, Skill skill)
        {
            try
            {
                var response = await _httpClient.PutAsJsonAsync($"{ApiBaseUrl}/{id}", skill);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating skill: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteSkillAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{ApiBaseUrl}/{id}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting skill: {ex.Message}");
                return false;
            }
        }
    }
}
