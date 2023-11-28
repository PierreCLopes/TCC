using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.CreateModels;
using System.Text.RegularExpressions;
using Backend.Helpers;
using DemoToken;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TipopropostaController : ControllerBase
    {
        private readonly Contexto _context;

        public TipopropostaController(Contexto context)
        {
            _context = context;
        }

        [ClaimsAuthorize("Proposta", "Visualizar")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tipoproposta>>> GetTiposproposta(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null,
            [FromQuery] int? id = null)
        {
            IQueryable<Tipoproposta> query = _context.Tipoproposta;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            var totalCount = await query.CountAsync();

            if (id.HasValue)
            {
                var TipopropostaById = await query.FirstOrDefaultAsync(p => p.Id == id);
                if (TipopropostaById != null)
                {
                    // Obtenha os registros da paginação, excluindo o registro do ID
                    var tiposproposta = await query
                        .Where(p => p.Id != id)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

                    // Inclua o registro do ID na lista
                    tiposproposta.Add(TipopropostaById);

                    Response.Headers.Add("X-Total-Count", (totalCount - 1).ToString());

                    return Ok(tiposproposta);
                }
            }

            var Tiposproposta = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Tiposproposta);
        }

        [ClaimsAuthorize("Proposta", "Visualizar")]
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoPropostaDTO>> GetTipoProposta(int id)
        {
            var tipoProposta = await _context.Tipoproposta.FindAsync(id);

            if (tipoProposta == null)
            {
                return NotFound();
            }

            // Use LINQ para buscar os IDs relacionados na tabela TipoPropostaDocumentacao
            var tipoDocumentacaoObrigatoria = _context.Tipopropostadocumentacoes
                .Where(doc => doc.Tipoproposta == id)
                .Select(doc => doc.Tipodocumentacao)
                .ToList();

            var tipoPropostaDTO = new TipoPropostaDTO
            {
                Nome = tipoProposta.Nome,
                Observacao = tipoProposta.Observacao,
                TipoDocumentacaoObrigatoria = tipoDocumentacaoObrigatoria.ToArray()
            };

            return tipoPropostaDTO;
        }

        [ClaimsAuthorize("Proposta", "Editar")]
        [HttpPost]
        public async Task<ActionResult<Tipoproposta>> PostTipoProposta(TipoPropostaDTO tipoPropostaDTO)
        {
            // Verifique se já existe um tipo de documentação com o mesmo nome na base
            var tipoPropostaExistente = await _context.Tipoproposta.FirstOrDefaultAsync(t => t.Nome == tipoPropostaDTO.Nome);

            if (tipoPropostaExistente != null)
            {
                var error = new ApiError(409, "Já existe um Tipo de proposta com o mesmo Nome cadastrado.");
                return Conflict(error);
            }

            var tipoProposta = new Tipoproposta
            {
                Nome = tipoPropostaDTO.Nome,
                Observacao = tipoPropostaDTO.Observacao
            };

            // Adicione o TipoProposta ao contexto
            _context.Tipoproposta.Add(tipoProposta);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            // Verifique se existem IDs de documentações obrigatórias no DTO
            if (tipoPropostaDTO.TipoDocumentacaoObrigatoria != null && tipoPropostaDTO.TipoDocumentacaoObrigatoria.Length > 0)
            {
                // Crie registros TipoPropostaDocumentacao relacionando o TipoProposta com as documentações obrigatórias
                foreach (var documentacaoId in tipoPropostaDTO.TipoDocumentacaoObrigatoria)
                {
                    var tipoPropostaDocumentacao = new Tipopropostadocumentacao
                    {
                        Tipoproposta = tipoProposta.Id,
                        Tipodocumentacao = documentacaoId
                    };

                    _context.Tipopropostadocumentacoes.Add(tipoPropostaDocumentacao);
                }

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction("GetTipoProposta", new { id = tipoProposta.Id }, tipoProposta);
        }

        [ClaimsAuthorize("Proposta", "Editar")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoProposta(int id, TipoPropostaDTO tipoPropostaDTO)
        {
            var tipoProposta = await _context.Tipoproposta.FindAsync(id);

            if (tipoProposta == null)
            {
                return NotFound("Tipo de documentação não encontrada");
            }

            // Verifique se já existe um tipo de documentação com o mesmo nome na base
            var tipoPropostaExistente = await _context.Tipoproposta.FirstOrDefaultAsync(t => t.Nome == tipoPropostaDTO.Nome);

            if ((tipoPropostaExistente != null) && (tipoPropostaExistente.Id != tipoProposta.Id))
            {
                var error = new ApiError(409, "Já existe um Tipo de documentação com o mesmo Nome cadastrado.");
                return Conflict(error);
            }

            // Atualize as propriedades da instância existente de TipoProposta
            tipoProposta.Nome = tipoPropostaDTO.Nome;
            tipoProposta.Observacao = tipoPropostaDTO.Observacao;

            // Remova os registros TipoPropostaDocumentacao existentes relacionados a esta TipoProposta
            var existingDocumentacao = _context.Tipopropostadocumentacoes.Where(doc => doc.Tipoproposta == id);
            _context.Tipopropostadocumentacoes.RemoveRange(existingDocumentacao);

            // Verifique se existem IDs de documentações obrigatórias no DTO
            if (tipoPropostaDTO.TipoDocumentacaoObrigatoria != null && tipoPropostaDTO.TipoDocumentacaoObrigatoria.Length > 0)
            {
                // Crie novos registros TipoPropostaDocumentacao relacionando o TipoProposta com as documentações
                foreach (var documentacaoId in tipoPropostaDTO.TipoDocumentacaoObrigatoria)
                {
                    var tipoPropostaDocumentacao = new Tipopropostadocumentacao
                    {
                        Tipoproposta = tipoProposta.Id,
                        Tipodocumentacao = documentacaoId
                    };

                    _context.Tipopropostadocumentacoes.Add(tipoPropostaDocumentacao);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("Erro de concorrência ao salvar os dados");
            }

            return NoContent();
        }

        [ClaimsAuthorize("Proposta", "Excluir")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoProposta(int id)
        {
            var tipoProposta = await _context.Tipoproposta.FindAsync(id);
            if (tipoProposta == null)
            {
                return NotFound();
            }

            var PropostaVinculada = await _context.Proposta.AnyAsync(p => p.Tipo == id);
            if (PropostaVinculada)
            {
                var error = new ApiError(400, "Não é possível excluir esse tipo de proposta, pois ele está vinculado a uma proposta.");
                return BadRequest(error);
            }

            // Remova os registros TipoPropostaDocumentacao relacionados a esta TipoProposta
            var existingDocumentacao = _context.Tipopropostadocumentacoes.Where(doc => doc.Tipoproposta == id);
            _context.Tipopropostadocumentacoes.RemoveRange(existingDocumentacao);

            _context.Tipoproposta.Remove(tipoProposta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
