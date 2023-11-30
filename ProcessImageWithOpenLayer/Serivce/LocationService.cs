using ProcessImageWithOpenLayer.Data;
using ProcessImageWithOpenLayer.Response;

namespace ProcessImageWithOpenLayer.Serivce
{
    public class LocationService : ILocationService
    {
        private readonly HttpClient _httpClient;
        public LocationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task SaveLocation(Polygon polygon)
        {
            var responseMsg = await _httpClient.PostAsJsonAsync("Location", polygon);
        }

        public async Task<PolygonResponse> GetLocationsAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<PolygonResponse>("Location");
            return response ?? new PolygonResponse();
        }

        public async Task DeleteLocation(long id)
        {
            var responseMsg = await _httpClient.DeleteAsync("Location/" + id);
        }
    }
}
