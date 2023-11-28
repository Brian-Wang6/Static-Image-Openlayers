namespace ProcessImageWithOpenLayer.Data
{
    public class Polygon
    {
        public long LocationUID { get; set; }
        public List<List<Point>> Points { get; set; } = new List<List<Point>>();
    }

    //public class Geom
    //{
    //    public long LocationUID { get; set; }
    //    public List<Polygon> Points { get; set; } = new List<Polygon>();
    //}
}
