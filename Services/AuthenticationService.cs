using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Server.Services
{
    public class AuthenticationService
    {
        private readonly string key;
        private readonly IMongoCollection<User> _auth;
        private readonly IMongoCollection<Place> _place;
        public AuthenticationService(IOptions<MDatabaseSettings> options, IConfiguration configuration)
        {
            var mongoClient = new MongoClient(options.Value.ConnectionString);
            _auth = mongoClient
                .GetDatabase(options.Value.DatabaseName)
                .GetCollection<User>(options.Value.CollectionName);
            _place = mongoClient
                .GetDatabase(options.Value.DatabaseName)
                .GetCollection<Place>("places");
            key = configuration.GetSection("JwtKey").ToString();
       }

        public async Task<List<User>> GetAll() =>
            await _auth.Find(_ => true).ToListAsync();

        public async Task<List<Place>> GetAllPlaces() =>
           await _place.Find(_ => true).ToListAsync();

        public string Authenticate(string email, string password)
        {
            var user = _auth.Find(s => s.Email == email && s.Password == password).FirstOrDefault();
            if (user == null)
                return null;

            var tokenHendler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(key);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email,email),
                }),
                Expires = DateTime.Now.AddHours(1),

                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHendler.CreateToken(tokenDescriptor);
            return tokenHendler.WriteToken(token);
        }

        public async Task Create(User user) =>
            await _auth.InsertOneAsync(user);

        public async Task CreatePlace(Place place) =>
            await _place.InsertOneAsync(place);

        public async Task DeletePlace(string id) =>
            await _place.DeleteOneAsync(s => s.Id == id);

        public async Task<User> Get(string email) =>
            await _auth.Find(s => s.Email == email).FirstOrDefaultAsync();

        public async Task UpdatePass(string id, User user) =>
            await _auth.ReplaceOneAsync(s => s.Id == id, user);

        public async Task Delete(string id) =>
            await _auth.DeleteOneAsync(s => s.Id == id);

        public async Task UpdatePlace(string id, Place place) =>
            await _place.ReplaceOneAsync(s => s.Id == id, place);

        public async Task<Place> GetPlace(string id) =>
            await _place.Find(s => s.Id == id).FirstOrDefaultAsync();
    }
}
