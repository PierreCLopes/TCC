using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.DTOModels;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PropostaImovelController : ControllerBase
    {
        private readonly Contexto _context;

        public PropostaImovelController(Contexto context)
        {
            _context = context;
        }

        [HttpGet("proposta/{PropostaId}")]
        public async Task<ActionResult<IEnumerable<Propostaimovel>>> GetPropostaimoveis(int PropostaId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null)
        {
            IQueryable<Propostaimovel> query = _context.Propostaimoveis;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.ImovelNavigation.Nome.Contains(nome));
            }

            //-- Pega o total de registros da base com o filtro de nome
            var totalCount = await query.CountAsync();

            //-- Pega os registros filtrando pelos query paramns
            var Propostaimoveis = await query
                .Where(p => p.Proposta == PropostaId)
                .Select(p => new {
                    p.Id,
                    p.Area,
                    imovelnome = p.ImovelNavigation.Nome
                })  
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Propostaimoveis);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Propostaimovel>> GetPropostaimovel(int id)
        {
            var Propostaimovel = await _context.Propostaimoveis.FindAsync(id);

            if (Propostaimovel == null)
            {
                return NotFound();
            }

            return Propostaimovel;
        }

        [HttpPost]
        public async Task<ActionResult<Propostaimovel>> PostPropostaimovel(PropostaImovelDTO Propostaimovel)
        {
            // Verifique se já existe um imovel da proposta com o mesmo imovel
            var PropostaimovelExistente = await _context.Propostaimoveis.FirstOrDefaultAsync(p => (p.Imovel == Propostaimovel.Imovel) && 
                                                                                                  (p.Proposta == Propostaimovel.Proposta));

            if (PropostaimovelExistente != null)
            {
                var error = new ApiError(409, "Esse imóvel já está cadastrado para essa proposta.");
                return Conflict(error);
            }

            // Verificar o imóvel e a área informada
            var Imovel = await _context.Imoveis.FirstOrDefaultAsync(i => (i.Id == Propostaimovel.Imovel));

            if (Imovel == null)
            {
                var error = new ApiError(404, "O imóvel informado não foi encontrado.");
                return NotFound(error);
            }

            if (Imovel.Areatotal < Propostaimovel.Area)
            {
                var error = new ApiError(400, "A área informada é maior que a área total do imóvel.");
                return BadRequest(error);
            }

            var PropostaImovel = new Propostaimovel
            {
                Area = Propostaimovel.Area,
                Imovel = Propostaimovel.Imovel,
                Proposta = Propostaimovel.Proposta,
            };

            _context.Propostaimoveis.Add(PropostaImovel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPropostaimovel", new { id = PropostaImovel.Id }, PropostaImovel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPropostaimovel(int id, PropostaImovelDTO PropostaImovelDTO)
        {
            // Verifique se já existe um imovel da proposta com o mesmo imovel
            var PropostaimovelExistente = await _context.Propostaimoveis.FirstOrDefaultAsync(p => (p.Imovel == PropostaImovelDTO.Imovel) &&
                                                                                                  (p.Proposta == PropostaImovelDTO.Proposta) &&
                                                                                                  (p.Id != id));

            if (PropostaimovelExistente != null)
            {
                var error = new ApiError(409, "Esse imóvel já está cadastrado para essa proposta.");
                return Conflict(error);
            }

            // Verificar o imóvel e a área informada
            var Imovel = await _context.Imoveis.FirstOrDefaultAsync(i => (i.Id == PropostaImovelDTO.Imovel));

            if (Imovel == null)
            {
                var error = new ApiError(404, "O imóvel informado não foi encontrado.");
                return NotFound(error);
            }

            if (Imovel.Areatotal < PropostaImovelDTO.Area)
            {
                var error = new ApiError(400, "A área informada é maior que a área total do imóvel.");
                return BadRequest(error);
            }

            var PropostaImovel = new Propostaimovel
            {
                Id = id,
                Area = PropostaImovelDTO.Area,
                Imovel = PropostaImovelDTO.Imovel,
                Proposta = PropostaImovelDTO.Proposta,
            };

            _context.Entry(PropostaImovel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropostaimovelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePropostaimovel(int id)
        {
            var Propostaimovel = await _context.Propostaimoveis.FindAsync(id);
            if (Propostaimovel == null)
            {
                return NotFound();
            }

            _context.Propostaimoveis.Remove(Propostaimovel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropostaimovelExists(int id)
        {
            return _context.Propostaimoveis.Any(e => e.Id == id);
        }
    }
}
