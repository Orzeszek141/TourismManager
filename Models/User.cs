using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public record User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("email")]
        [EmailAddress]
        public string Email { get; set; }
        [BsonElement("password")]
        public string Password { get; set; }
        [BsonElement("role")]
        public UserRole Role { get; set; }
        
    }

    public enum UserRole
    {
        Administrator,
        User
    }
}
