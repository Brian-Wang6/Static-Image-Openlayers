using ProcessImageWithOpenLayer.Data;
using ProcessImageWithOpenLayer.Response;

namespace ProcessImageWithOpenLayer.Serivce
{
    public interface ILocationService
    {
        Task SaveLocation(Polygon polygon);
        Task<PolygonResponse> GetLocationsAsync();
        Task DeleteLocation(long id);
    }
}
