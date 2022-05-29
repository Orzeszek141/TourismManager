using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Auth
    {
        [BsonElement("email")]
        [EmailAddress]
        public string Email { get; set; }
        [BsonElement("password")]
        public string Password { get; set; }
    }
}
