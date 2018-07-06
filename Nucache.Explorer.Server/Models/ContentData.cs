using System;
using System.Collections.Generic;

namespace Nucache.Explorer.Server.Models
{
    // represents everything that is specific to edited or published version
    internal class ContentData
    {
        public bool Published { get; set; }

        public string Name { get; set; }
        public int VersionId { get; set; }
        public DateTime VersionDate { get; set; }
        public int WriterId { get; set; }
        public int TemplateId { get; set; }

        public IDictionary<string, PropertyData[]> Properties { get; set; }
    }
}
