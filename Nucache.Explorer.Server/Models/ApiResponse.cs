namespace Nucache.Explorer.Server.Models
{
    public class ApiResponse
    {
        public int TotalItems { get; set; }

        public ContentNodeKit[] Items { get; set; }

        public long StopClock { get; set; }
    }
}
