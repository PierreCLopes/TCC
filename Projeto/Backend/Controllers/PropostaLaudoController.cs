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
            var Proposta = await _context.Proposta.FindAsync(Propostalaudo.Proposta);

            if (Proposta == null)
            {
                var error = new ApiError(404, "Proposta não encontrada.");
                return NotFound(error);
            }

            if (Proposta.Status != StatusProposta.Cadastrada)
            {
                var error = new ApiError(400, "Status inválido. A proposta precisa estar no status Cadastrada para cadastrar algum laudo.");
                return BadRequest(error);
            }

            if (Proposta.Ehpossuilaudoacompanhamento != true)
            {
                var error = new ApiError(400, "Proposta inválida. A proposta não está marcada para possuir laudo de acompanhamento.");
                return BadRequest(error);
            }

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
            var PropostaLaudo = await _context.Propostalaudos.FindAsync(id);
            if (PropostaLaudo == null)
            {
                var error = new ApiError(404, "Laudo não encontrado.");
                return NotFound(error);
            }

            if (PropostaLaudo.Status != StatusPropostaLaudo.Cadastrado)
            {
                var error = new ApiError(400, "Status inválido. O laudo precisa estar no status Cadastrado para ser alterado.");
                return BadRequest(error);
            }

            PropostaLaudo.Datalaudo = Propostalaudo.Datalaudo;
            PropostaLaudo.Proposta = Propostalaudo.Proposta;
            PropostaLaudo.Datavistoria = Propostalaudo.Datavistoria;
            PropostaLaudo.Ehareacultivadafinanciada = Propostalaudo.Ehareacultivadafinanciada;
            PropostaLaudo.Ehcreditoaplicadocorreto = Propostalaudo.Ehcreditoaplicadocorreto;
            PropostaLaudo.Ehatendendorecomendacao = Propostalaudo.Ehatendendorecomendacao;
            PropostaLaudo.Ehcroquiidentificaarea = Propostalaudo.Ehcroquiidentificaarea;
            PropostaLaudo.Ehepocaplantiozoneamento = Propostalaudo.Ehepocaplantiozoneamento;
            PropostaLaudo.Ehlavouraplantadafinanciada = Propostalaudo.Ehlavouraplantadafinanciada;
            PropostaLaudo.Ehpossuiarearecursoproprio = Propostalaudo.Ehpossuiarearecursoproprio;
            PropostaLaudo.Observacao = Propostalaudo.Observacao;
            PropostaLaudo.Produtividadeobtida = Propostalaudo.Produtividadeobtida;
            PropostaLaudo.Produtividadeplano = Propostalaudo.Produtividadeplano;
            PropostaLaudo.Situacaoempreendimento = Propostalaudo.Situacaoempreendimento;
            PropostaLaudo.Status = StatusPropostaLaudo.Cadastrado;

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

            var Proposta = await _context.Proposta.FindAsync(Propostalaudo.Proposta);

            if (Proposta == null)
            {
                var error = new ApiError(404, "Proposta não encontrada.");
                return NotFound(error);
            }

            if (Proposta.Status != StatusProposta.Cadastrada)
            {
                var error = new ApiError(400, "Status inválido. A proposta precisa estar no status Cadastrada para cadastrar algum laudo.");
                return BadRequest(error);
            }

            _context.Propostalaudos.Remove(Propostalaudo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("liberar/{id}")]
        public async Task<IActionResult> LiberarPropostaLaudo(int id)
        {
            var PropostaLaudo = await _context.Propostalaudos.FindAsync(id);
            if (PropostaLaudo == null)
            {
                var error = new ApiError(404, "Laudo não encontrado.");
                return NotFound(error);
            }

            if (PropostaLaudo.Status != StatusPropostaLaudo.Cadastrado)
            {
                var error = new ApiError(400, "Status inválido. O laudo precisa estar no status Cadastrado para ser liberado.");
                return BadRequest(error);
            }

            var PropostaLaudoDiagnostico = await _context.Propostalaudodiagnosticos.AnyAsync(pld => pld.Propostalaudo == id);

            if (!PropostaLaudoDiagnostico)
            {
                var error = new ApiError(400, "Diagnóstico inválido. O laudo precisa possuir um diagnóstico para ser liberado.");
                return BadRequest(error);
            }

            PropostaLaudo.Status = StatusPropostaLaudo.Encerrado;

            // Atualiza o status da proposta caso todos os laudos já tenham encerrado
            {
                var Proposta = await _context.Proposta.FindAsync(PropostaLaudo.Proposta);
                if (Proposta == null)
                {
                    var error = new ApiError(404, "Proposta não encontrada.");
                    return NotFound(error);
                }

                var Status = StatusProposta.AguardandoLaudosDeAcompanhamento;

                var Acompanhamento = await _context.Propostalaudos.FirstOrDefaultAsync(laudo =>
                        (laudo.Proposta == Proposta.Id) && (laudo.Status == StatusPropostaLaudo.Cadastrado));

                if (Acompanhamento == null)
                {
                    Status = StatusProposta.AguardandoLaudosDeAcompanhamento;
                }
                else
                {
                    Status = StatusProposta.Encerrada;
                }

                Proposta.Status = Status;
            }

            await _context.SaveChangesAsync();

            return Ok(PropostaLaudo);
        }

        [HttpPost("voltar/{id}")]
        public async Task<IActionResult> VoltarPropostaLaudo(int id)
        {
            var PropostaLaudo = await _context.Propostalaudos.FindAsync(id);
            if (PropostaLaudo == null)
            {
                return NotFound();
            }

            if (PropostaLaudo.Status == StatusProposta.Cadastrada)
            {
                var error = new ApiError(400, "Status inválido. O laudo não pode estar cadastrado para voltar o status.");
                return BadRequest(error);
            }

            PropostaLaudo.Status = StatusProposta.Cadastrada;

            // Atualiza o status da proposta caso todos os laudos já tenham encerrado
            {
                var Proposta = await _context.Proposta.FindAsync(PropostaLaudo.Proposta);
                if (Proposta == null)
                {
                    var error = new ApiError(404, "Proposta não encontrada.");
                    return NotFound(error);
                }

                var Status = StatusProposta.AguardandoLaudosDeAcompanhamento;

                var Acompanhamento = await _context.Propostalaudos.FirstOrDefaultAsync(laudo =>
                        (laudo.Proposta == Proposta.Id) && (laudo.Status == StatusPropostaLaudo.Cadastrado));

                if (Acompanhamento == null)
                {
                    Status = StatusProposta.AguardandoLaudosDeAcompanhamento;
                }
                else
                {
                    Status = StatusProposta.Encerrada;
                }

                Proposta.Status = Status;
            }

            await _context.SaveChangesAsync();

            return Ok(PropostaLaudo);
        }

        private bool PropostalaudoExists(int id)
        {
            return _context.Propostalaudos.Any(e => e.Id == id);
        }
    }
}
