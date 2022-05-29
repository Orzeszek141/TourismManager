
namespace Server.Services
{
    public class PlaceService
    {
        private readonly IMongoCollection<Place> _places;

        public PlaceService(IOptions<MDatabaseSettings> options)
        {
            var mongoClient = new MongoClient(options.Value.ConnectionString);

            _places = mongoClient
                .GetDatabase(options.Value.DatabaseName)
                .GetCollection<Place>(options.Value.CollectionName);
        }

        public async Task<List<Place>> GetAll() =>
            await _places.Find(_ => true).ToListAsync();

        public async Task<Place> Get(string id) =>
            await _places.Find(s => s.Id == id).FirstOrDefaultAsync();

        public async Task Create(Place place) =>
            await _places.InsertOneAsync(place);

        public async Task Update(string id, Place place) =>
            await _places.ReplaceOneAsync(s => s.Id == id, place);

        public async Task Delete(string id) =>
            await _places.DeleteOneAsync(s => s.Id == id);
    }
}
