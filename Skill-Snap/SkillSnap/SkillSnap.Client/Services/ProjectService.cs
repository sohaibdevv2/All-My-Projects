using System.Net.Http.Json;
using SkillSnap.Client.Models;

namespace SkillSnap.Client.Services
{
    public class ProjectService
    {
        private readonly HttpClient _httpClient;
        private const string ApiBaseUrl = "api/projects";

        public ProjectService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Project>> GetProjectsAsync()
        {
            try
            {
                var projects = await _httpClient.GetFromJsonAsync<List<Project>>(ApiBaseUrl);
                return projects ?? new List<Project>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching projects: {ex.Message}");
                return new List<Project>();
            }
        }

        public async Task<Project?> GetProjectAsync(int id)
        {
            try
            {
                return await _httpClient.GetFromJsonAsync<Project>($"{ApiBaseUrl}/{id}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching project {id}: {ex.Message}");
                return null;
            }
        }

        public async Task<Project?> AddProjectAsync(Project newProject)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync(ApiBaseUrl, newProject);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<Project>();
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding project: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> UpdateProjectAsync(int id, Project project)
        {
            try
            {
                var response = await _httpClient.PutAsJsonAsync($"{ApiBaseUrl}/{id}", project);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating project: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{ApiBaseUrl}/{id}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting project: {ex.Message}");
                return false;
            }
        }
    }
}
