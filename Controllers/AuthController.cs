using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http.Cors;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Server.Controllers
{
    
    [EnableCors(origins: "http://localhost:3000/", headers: "*", methods: "*")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthenticationService _authService;
        public AuthController(AuthenticationService authenticationService)
        {
            _authService = authenticationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<List<User>> Get()
        {
            return await _authService.GetAll();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("getUsers")]
        public async Task<List<User>> GetAllUsers()
        {
            return await _authService.GetAll();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("authenticate")]
        public ActionResult Login([FromBody] Auth auth)
        {
            var token = _authService.Authenticate(auth.Email, auth.Password);
            if (token == null)
            {
                return Unauthorized();
            }
            return Ok(new { token, auth});
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            await _authService.Create(user);
            return NoContent();
        }

        [HttpGet]
        [Authorize]
        [Route("getUser/{email}")]
        public async Task<User> GetSingle(string email)
        {
            return await _authService.Get(email);
        }

        [HttpPut]
        [Authorize]
        [Route("changePassword/{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] User user)
        {
            await _authService.UpdatePass(id, user);
            return NoContent();
        }

        [HttpDelete]
        [Authorize]
        [Route("remove/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _authService.Delete(id);
            return NoContent();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("places")]
        public async Task<List<Place>> GetPlaces()
        {
            return await _authService.GetAllPlaces();
        }

        [HttpDelete]
        [Authorize]
        [Route("removePlace/{id}")]
        public async Task<IActionResult> DeletePlace(string id)
        {
            await _authService.DeletePlace(id);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("addPlace")]
        public async Task<IActionResult> PostPlace([FromBody] Place place)
        {
            await _authService.CreatePlace(place);
            return NoContent();
        }

        [HttpPut]
        [Authorize]
        [Route("changePlace/{id}")]
        public async Task<IActionResult> UpdatePlace(string id, [FromBody] Place place)
        {
            await _authService.UpdatePlace(id, place);
            return NoContent();
        }

        [HttpGet]
        [Authorize]
        [Route("getPlace/{id}")]
        public async Task<Place> GetSinglePlace(string id)
        {
            return await _authService.GetPlace(id);
        }
    }
}
