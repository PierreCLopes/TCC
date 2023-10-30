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
    public class PropostaLaudoController : ControllerBase
    {
        private readonly Contexto _context;

        public PropostaLaudoController(Contexto context)
        {
            _context = context;
        }

        [HttpGet("proposta/{PropostaId}")]
        public async Task<ActionResult<IEnumerable<Propostalaudo>>> GetPropostalaudos(int PropostaId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            IQueryable<Propostalaudo> query = _context.Propostalaudos;

            //-- Pega o total de registros da base com o filtro de nome
            var totalCount = await query.CountAsync();

            //-- Pega os registros filtrando pelos query paramns
            var Propostalaudos = await query
                .Where(p => p.Proposta == PropostaId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Propostalaudos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Propostalaudo>> GetPropostalaudo(int id)
        {
            var Propostalaudo = await _context.Propostalaudos.FindAsync(id);

            if (Propostalaudo == null)
            {
                return NotFound();
            }

            return Propostalaudo;
        }

        [HttpPost]
        public async Task<ActionResult<Propostalaudo>> PostPropostalaudo(PropostaLaudoDTO Propostalaudo)
        {
            IQueryable<Propostalaudo> query = _context.Propostalaudos;

            var Sequencial = await query.Where(p => p.Proposta == Propostalaudo.Proposta).CountAsync();

            var PropostaLaudo = new Propostalaudo
            {
                Datalaudo = Propostalaudo.Datalaudo,
                Proposta = Propostalaudo.Proposta,
                Datavistoria = Propostalaudo.Datavistoria,
                Ehareacultivadafinanciada = Propostalaudo.Ehareacultivadafinanciada,
                Ehcreditoaplicadocorreto = Propostalaudo.Ehcreditoaplicadocorreto,
                Ehatendendorecomendacao = Propostalaudo.Ehatendendorecomendacao,
                Ehcroquiidentificaarea = Propostalaudo.Ehcroquiidentificaarea,
                Ehepocaplantiozoneamento = Propostalaudo.Ehepocaplantiozoneamento,
                Ehlavouraplantadafinanciada = Propostalaudo.Ehlavouraplantadafinanciada,
                Ehpossuiarearecursoproprio = Propostalaudo.Ehpossuiarearecursoproprio,
                Observacao = Propostalaudo.Observacao,
                Produtividadeobtida = Propostalaudo.Produtividadeobtida,
                Produtividadeplano = Propostalaudo.Produtividadeplano,
                Situacaoempreendimento = Propostalaudo.Situacaoempreendimento,
                Status = StatusPropostaLaudo.Cadastrado,
                Sequencial = Sequencial + 1,
            };

            _context.Propostalaudos.Add(PropostaLaudo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPropostalaudo", new { id = PropostaLaudo.Id }, PropostaLaudo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPropostalaudo(int id, PropostaLaudoDTO Propostalaudo)
        {
            var PropostaLaudo = new Propostalaudo
            {
                Datalaudo = Propostalaudo.Datalaudo,
                Proposta = Propostalaudo.Proposta,
                Datavistoria = Propostalaudo.Datavistoria,
                Ehareacultivadafinanciada = Propostalaudo.Ehareacultivadafinanciada,
                Ehcreditoaplicadocorreto = Propostalaudo.Ehcreditoaplicadocorreto,
                Ehatendendorecomendacao = Propostalaudo.Ehatendendorecomendacao,
                Ehcroquiidentificaarea = Propostalaudo.Ehcroquiidentificaarea,
                Ehepocaplantiozoneamento = Propostalaudo.Ehepocaplantiozoneamento,
                Ehlavouraplantadafinanciada = Propostalaudo.Ehlavouraplantadafinanciada,
                Ehpossuiarearecursoproprio = Propostalaudo.Ehpossuiarearecursoproprio,
                Observacao = Propostalaudo.Observacao,
                Produtividadeobtida = Propostalaudo.Produtividadeobtida,
                Produtividadeplano = Propostalaudo.Produtividadeplano,
                Situacaoempreendimento = Propostalaudo.Situacaoempreendimento,
                Status = StatusPropostaLaudo.Cadastrado,
            };

            _context.Entry(PropostaLaudo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropostalaudoExists(id))
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
        public async Task<IActionResult> DeletePropostalaudo(int id)
        {
            var Propostalaudo = await _context.Propostalaudos.FindAsync(id);
            if (Propostalaudo == null)
            {
                return NotFound();
            }

            _context.Propostalaudos.Remove(Propostalaudo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropostalaudoExists(int id)
        {
            return _context.Propostalaudos.Any(e => e.Id == id);
        }
    }
}
