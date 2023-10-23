using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Backend.Models; // Importe os modelos relevantes
using Backend.Models.CreateModels;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public ClaimsController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        // Atualizar o valor de uma claim de um usuário
        [HttpPut("{userId}/{claimType}")]
        public async Task<IActionResult> UpdateClaimValue(string userId, string claimType, ClaimDTO newClaimValue)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var existingClaims = await _userManager.GetClaimsAsync(user);
            var claimToUpdate = existingClaims.FirstOrDefault(claim => claim.Type == claimType);

            if (claimToUpdate == null)
            {
                return NotFound("Claim não encontrada.");
            }

            var result = await _userManager.ReplaceClaimAsync(user, claimToUpdate, new System.Security.Claims.Claim(claimType, newClaimValue.Valor));

            if (result.Succeeded)
            {
                return Ok("Claim atualizada com sucesso.");
            }

            return BadRequest(result.Errors);
        }

        // Obter todas as claims de um usuário
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetClaimsForUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var claims = await _userManager.GetClaimsAsync(user);

            var claimModels = claims.Select(claim => new ClaimDTO
            {
                Tipo = claim.Type,
                UserId = userId,
                Valor = claim.Value
            }).ToList();

            return Ok(claimModels);
        }

        [HttpGet("{userId}/{claimType}")]
        public async Task<IActionResult> GetClaimForUser(string userId, string claimType)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var claims = await _userManager.GetClaimsAsync(user);

            var specificClaim = claims.FirstOrDefault(c => c.Type == claimType);

            if (specificClaim == null)
            {
                return NotFound("Reivindicação não encontrada.");
            }

            // Mapeie a reivindicação para o formato desejado
            var claimModel = new ClaimDTO
            {
                Tipo = specificClaim.Type,
                UserId = userId,
                Valor = specificClaim.Value
            };

            return Ok(claimModel);
        }

    }
}
