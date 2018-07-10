using Newtonsoft.Json;

namespace Nucache.Explorer.Server.Models
{
    // what's needed to actually build a content node
    public struct ContentNodeKit
    {
        public ContentNode Node;
        public int ContentTypeId;
        public ContentData DraftData;
        public ContentData PublishedData;

        [JsonIgnore]
        public bool IsEmpty => Node == null;

        [JsonIgnore]
        public bool IsNull => ContentTypeId < 0;

        public static ContentNodeKit Null { get; } = new ContentNodeKit { ContentTypeId = -1 };

        //public void Build(PublishedContentType contentType, IPublishedSnapshotAccessor publishedSnapshotAccessor)
        //{
        //    Node.SetContentTypeAndData(contentType, DraftData, PublishedData, publishedSnapshotAccessor);
        //}
    }
}
