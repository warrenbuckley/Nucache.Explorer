using System;
using Newtonsoft.Json;

namespace Nucache.Explorer.Server.Models
{
    public class CultureVariation
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("date")]
        public DateTime Date { get; set; }
    }
}
