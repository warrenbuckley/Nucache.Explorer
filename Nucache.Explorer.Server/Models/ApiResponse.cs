namespace Nucache.Explorer.Server.Models
{
    public class ApiResponse
    {
        public int TotalItems { get; set; }

        public ContentNodeKit[] Items { get; set; }

        public StopClock StopClock { get; set; }

    }

    public class StopClock
    {
        public int Hours { get; set; }
        public int Minutes { get; set; }
        public int Seconds { get; set; }
        public int Milliseconds { get; set; }
        public long Ticks { get; set; }
    }
}
