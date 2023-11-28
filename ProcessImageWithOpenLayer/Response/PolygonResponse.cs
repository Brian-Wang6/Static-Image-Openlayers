using NpgsqlGeometry.Response;
using ProcessImageWithOpenLayer.Data;

namespace ProcessImageWithOpenLayer.Response
{
    public class PolygonResponse : BaseResponse
    {
        public List<Polygon> Polygons { get; set; } = new List<Polygon>();
    }
}
