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
    public class PropostaLaudoDiagnosticoController : ControllerBase
    {
        private readonly Contexto _context;

        public PropostaLaudoDiagnosticoController(Contexto context)
        {
            _context = context;
        }

        [HttpGet("propostalaudo/{PropostaLaudoId}")]
        public async Task<ActionResult<IEnumerable<Propostalaudodiagnostico>>> GetPropostalaudodiagnosticodiagnosticos(int PropostaLaudoId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            IQueryable<Propostalaudodiagnostico> query = _context.Propostalaudodiagnosticos;

            //-- Pega o total de registros da base com o filtro de nome
            var totalCount = await query.CountAsync();

            //-- Pega os registros filtrando pelos query paramns
            var Propostalaudodiagnostico = await query
                .Where(p => p.Propostalaudo == PropostaLaudoId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Propostalaudodiagnostico);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Propostalaudodiagnostico>> GetPropostalaudodiagnostico(int id)
        {
            var Propostalaudodiagnostico = await _context.Propostalaudodiagnosticos.FindAsync(id);

            if (Propostalaudodiagnostico == null)
            {
                return NotFound();
            }

            return Propostalaudodiagnostico;
        }

        [HttpPost]
        public async Task<ActionResult<Propostalaudodiagnostico>> PostPropostalaudodiagnostico(PropostaLaudoDiagnosticoDTO Propostalaudodiagnostico)
        {
            IQueryable<Propostalaudodiagnostico> query = _context.Propostalaudodiagnosticos;

            var PropostaLaudoDiagnostico = new Propostalaudodiagnostico
            {
                Areaafetada = Propostalaudodiagnostico.Areaafetada,
                Diagnostico = Propostalaudodiagnostico.Diagnostico,
                Ehalterouprodutividade = Propostalaudodiagnostico.Ehalterouprodutividade,
                Ehfazercontrole = Propostalaudodiagnostico.Ehfazercontrole,
                Nivel = Propostalaudodiagnostico.Nivel,
                Observacao = Propostalaudodiagnostico.Observacao,
                Propostalaudo = Propostalaudodiagnostico.Propostalaudo
            };

            _context.Propostalaudodiagnosticos.Add(PropostaLaudoDiagnostico);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPropostalaudodiagnostico", new { id = PropostaLaudoDiagnostico.Id }, PropostaLaudoDiagnostico);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPropostalaudodiagnostico(int id, PropostaLaudoDiagnosticoDTO Propostalaudodiagnostico)
        {
            var PropostaLaudoDiagnostico = new Propostalaudodiagnostico
            {
                Id = id,
                Areaafetada = Propostalaudodiagnostico.Areaafetada,
                Diagnostico = Propostalaudodiagnostico.Diagnostico,
                Ehalterouprodutividade = Propostalaudodiagnostico.Ehalterouprodutividade,
                Ehfazercontrole = Propostalaudodiagnostico.Ehfazercontrole,
                Nivel = Propostalaudodiagnostico.Nivel,
                Observacao = Propostalaudodiagnostico.Observacao,
                Propostalaudo = Propostalaudodiagnostico.Propostalaudo
            };

            _context.Entry(PropostaLaudoDiagnostico).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropostalaudodiagnosticoExists(id))
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
        public async Task<IActionResult> DeletePropostalaudodiagnostico(int id)
        {
            var Propostalaudodiagnostico = await _context.Propostalaudodiagnosticos.FindAsync(id);
            if (Propostalaudodiagnostico == null)
            {
                return NotFound();
            }

            _context.Propostalaudodiagnosticos.Remove(Propostalaudodiagnostico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropostalaudodiagnosticoExists(int id)
        {
            return _context.Propostalaudodiagnosticos.Any(e => e.Id == id);
        }
    }
}
