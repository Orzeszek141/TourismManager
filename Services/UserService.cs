
namespace Server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        User newuser1 = new User()
        {
            Name = "TestUser",
            Email = "testowyUser@o2.pl",
            Password = "Hasło123",
            Role = UserRole.User
        };

        User newuser2 = new User()
        {
            Name = "TestAdministrator",
            Email = "testowyAdministrator@o2.pl",
            Password = "Hasło123",
            Role = UserRole.Administrator
        };

        public UserService(IOptions<MDatabaseSettings> options)
        {
            var mongoClient = new MongoClient(options.Value.ConnectionString);

            _users = mongoClient
                .GetDatabase(options.Value.DatabaseName)
                .GetCollection<User>(options.Value.CollectionName);
        }

        public async Task<List<User>> GetAll() =>
            await _users.Find(_ => true).ToListAsync();

        public async Task<User> Get(string email) =>
            await _users.Find(s => s.Email == email).FirstOrDefaultAsync();

        public async Task Create(User user) =>
            await _users.InsertOneAsync(user);

        public async Task Update(string id, User user) =>
            await _users.ReplaceOneAsync(s => s.Id == id, user);

        public async Task Delete(string id) =>
            await _users.DeleteOneAsync(s => s.Id == id);
    }
}
