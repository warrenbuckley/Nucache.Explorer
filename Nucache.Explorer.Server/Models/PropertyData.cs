using Newtonsoft.Json;

namespace Nucache.Explorer.Server.Models
{
    class PropertyData
    {
        [JsonProperty("culture")]
        public string Culture { get; set; }

        [JsonProperty("seg")]
        public string Segment { get; set; }

        [JsonProperty("val")]
        public object Value { get; set; }
    }
}
