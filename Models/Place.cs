
using System.Text.Json.Serialization;

namespace Server.Models
{
    public record Place
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [BsonElement("description")]
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [BsonElement("url")]
        [JsonPropertyName("url")]
        public Uri Url { get; set; }

        [BsonElement("accepted")]
        [JsonPropertyName("accepted")]
        public bool Accepted { get; set; }

        [BsonElement("user")]
        [JsonPropertyName("user")]
        public User User { get; set; }

    }
}
