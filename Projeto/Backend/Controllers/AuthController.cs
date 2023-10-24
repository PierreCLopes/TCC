using Backend.Data;
using Backend.Models;
using DemoToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppSettings _appSettings;

        public AuthController(SignInManager<IdentityUser> signInManager,
                              UserManager<IdentityUser> userManager,
                              IOptions<AppSettings> appSettings)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _appSettings = appSettings.Value;
        }

        [ClaimsAuthorize("Usuario", "Editar")]
        [HttpPost("usuario")]
        public async Task<ActionResult> Registrar(RegisterUserViewModel registerUser)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState.Values.SelectMany(e => e.Errors));

            var usuarioExistente = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == registerUser.Email);

            if (usuarioExistente != null)
            {
                var error = new ApiError(409, "Já existe um usuário com esse Email cadastrado.");
                return Conflict(error);
            }

            var user = new IdentityUser
            {
                Email = registerUser.Email,
                UserName = registerUser.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, registerUser.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            // Crie reivindicações padrão para o usuário
            var defaultClaims = new List<System.Security.Claims.Claim>
            {
                new System.Security.Claims.Claim("Pessoa", ""),
                new System.Security.Claims.Claim("Cultura", ""),
                new System.Security.Claims.Claim("Usuario", "")
            };

            result = await _userManager.AddClaimsAsync(user, defaultClaims);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(await GerarJWT(registerUser.Email));
        }


        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginUserViewModel loginUser)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState.Values.SelectMany(e => e.Errors));

            var result = await _signInManager.PasswordSignInAsync(loginUser.Email, loginUser.Password, isPersistent: false, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                var userResponse = new UserResponse
                {
                    User = loginUser,
                    accessToken = await GerarJWT(loginUser.Email)
                };

                return Ok(userResponse);
            }

            return BadRequest("Usuário ou senha inválidos");
        }

        private async Task<string> GerarJWT(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var identityClaims = new ClaimsIdentity();
            identityClaims.AddClaims(await _userManager.GetClaimsAsync(user));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identityClaims,
                Issuer = _appSettings.Emissor,
                Audience = _appSettings.ValidoEm,
                Expires = DateTime.UtcNow.AddHours(_appSettings.ExpiracaoHoras),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }

        [ClaimsAuthorize("Usuario","Visualizar")]
        [HttpGet("usuarios")]
        public async Task<ActionResult<IEnumerable<UserViewModel>>> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? userName = null,
            [FromQuery] string? id = null) // Parâmetro para incluir um usuário por ID
        {
            IQueryable<IdentityUser> query = _userManager.Users;

            if (!string.IsNullOrEmpty(userName))
            {
                query = query.Where(u => u.UserName.Contains(userName));
            }

            if (!string.IsNullOrEmpty(id))
            {
                // Inclua o usuário com o ID especificado
                var userToInclude = await _userManager.FindByIdAsync(id);
                if (userToInclude != null)
                {
                    query = query.Union(new[] { userToInclude }.AsQueryable());
                }
            }

            var totalCount = await query.CountAsync();

            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Mapeie os objetos IdentityUser para UserViewModel
            var userViewModels = users.Select(user => new UserViewModel
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.PasswordHash, 
                ConfirmPassword = user.PasswordHash 
            }).ToList();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(userViewModels);
        }



        [ClaimsAuthorize("Usuario", "Visualizar")]
        [HttpGet("usuario/{id}")]
        public async Task<IActionResult> GetUsuarioAsync(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
            }

            var usuario = await _userManager.FindByIdAsync(id);

            if (usuario == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // Mapeie as propriedades do IdentityUser para um objeto UserViewModel
            var userViewModel = new UserViewModel
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Password = usuario.PasswordHash, 
                ConfirmPassword = usuario.PasswordHash
            };

            return Ok(userViewModel);
        }

        [ClaimsAuthorize("Usuario", "Excluir")]
        [HttpDelete("usuario/{id}")]
        public async Task<IActionResult> DeleteUsuario(string id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState.Values.SelectMany(e => e.Errors));

            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // Exclua as claims do usuário
            var claims = await _userManager.GetClaimsAsync(user);
            foreach (var claim in claims)
            {
                var resultClaim = await _userManager.RemoveClaimAsync(user, claim);
                if (!resultClaim.Succeeded)
                {
                    return BadRequest(resultClaim.Errors);
                }
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Usuário excluído com sucesso.");
        }

    }
}
