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

namespace Backend.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TipodocumentacaoController : ControllerBase
    {
        private readonly Contexto _context;

        public TipodocumentacaoController(Contexto context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tipodocumentacao>>> GetTipodocumentacaos(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null,
            [FromQuery] int? id = null)
        {
            IQueryable<Tipodocumentacao> query = _context.Tipodocumentacoes;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            var totalCount = await query.CountAsync();

            if (id.HasValue)
            {
                var TipodocumentacaoById = await query.FirstOrDefaultAsync(p => p.Id == id);
                if (TipodocumentacaoById != null)
                {
                    // Obtenha os registros da paginação, excluindo o registro do ID
                    var TipoDocumentacoes = await query
                        .Where(p => p.Id != id)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

                    // Inclua o registro do ID na lista
                    TipoDocumentacoes.Add(TipodocumentacaoById);

                    Response.Headers.Add("X-Total-Count", (totalCount - 1).ToString());

                    return Ok(TipoDocumentacoes);
                }
            }

            var Tipodocumentacoes = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Tipodocumentacoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TipoDocumentacaoDTO>> GetTipodocumentacao(int id)
        {
            var Tipodocumentacao = await _context.Tipodocumentacoes.FindAsync(id);

            if (Tipodocumentacao == null)
            {
                return NotFound();
            }

            var TipodocumentacaoDTO = new TipoDocumentacaoDTO
            {
                Nome = Tipodocumentacao.Nome,
                Sigla = Tipodocumentacao.Sigla,
                Observacao = Tipodocumentacao.Observacao
            };

            return TipodocumentacaoDTO;
        }

        [HttpGet("todos")]
        public async Task<ActionResult<List<Tipodocumentacao>>> GetTodosTipodocumentacao()
        {
            var tipoDocumentacoes = await _context.Tipodocumentacoes.ToListAsync();

            return tipoDocumentacoes;
        }

        [HttpPost]
        public async Task<ActionResult<Tipodocumentacao>> PostTipodocumentacao(TipoDocumentacaoDTO TipodocumentacaoDTO)
        {
            // Verifique se já existe um tipo de documentacao com o mesmo nome na base
            var TipodocumentacaoExistente = await _context.Tipodocumentacoes.FirstOrDefaultAsync(t => t.Nome == TipodocumentacaoDTO.Nome);

            if (TipodocumentacaoExistente != null)
            {
                var error = new ApiError(409, "Já existe um Tipo de documentação com o mesmo Nome cadastrado.");
                return Conflict(error);
            }

            var Tipodocumentacao = new Tipodocumentacao
            {
                Nome = TipodocumentacaoDTO.Nome,
                Sigla = TipodocumentacaoDTO.Sigla,
                Observacao = TipodocumentacaoDTO.Observacao
            };

            // Adicione a Tipodocumentacao ao contexto
            _context.Tipodocumentacoes.Add(Tipodocumentacao);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTipodocumentacao", new { id = Tipodocumentacao.Id }, Tipodocumentacao);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipodocumentacao(int id, TipoDocumentacaoDTO TipodocumentacaoDTO)
        {
            var Tipodocumentacao = await _context.Tipodocumentacoes.FindAsync(id);

            if (Tipodocumentacao == null)
            {
                return NotFound("Tipo de documentação não encontrada");
            }

            // Verifique se já existe uma Tipodocumentacao com o mesmo nome na base
            var TipodocumentacaoExistente = await _context.Tipodocumentacoes.FirstOrDefaultAsync(f => f.Nome == TipodocumentacaoDTO.Nome);

            if ((TipodocumentacaoExistente != null) && (TipodocumentacaoExistente.Id != Tipodocumentacao.Id))
            {
                var error = new ApiError(409, "Já existe um Tipo de documentação com o mesmo Nome cadastrado.");
                return Conflict(error);
            }

            // Atualize as propriedades da instância existente de Tipodocumentacao
            Tipodocumentacao.Nome = TipodocumentacaoDTO.Nome;
            Tipodocumentacao.Sigla = TipodocumentacaoDTO.Sigla;
            Tipodocumentacao.Observacao = TipodocumentacaoDTO.Observacao;

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipodocumentacao(int id)
        {
            // Verifique se existe alguma Documentacao vinculada a este tipo
            var temDocumentacao = await _context.Documentacoes.AnyAsync(d => d.Tipo == id);

            if (temDocumentacao)
            {
                var error = new ApiError(400, "Não é possível excluir o Tipo de documentação, pois há Documentações com este tipo.");
                return BadRequest(error);

            }

            // Verifique se existe alguma Documentacao vinculada a este tipo
            var temTipoProposta = await _context.Tipopropostadocumentacoes.AnyAsync(t => t.Tipodocumentacao == id);

            if (temTipoProposta)
            {
                var error = new ApiError(400, "Não é possível excluir o Tipo de documentação, pois ela está vinculada como obrigatória a um Tipo de proposta.");
                return BadRequest(error);
            }

            var Tipodocumentacao = await _context.Tipodocumentacoes.FindAsync(id);
            if (Tipodocumentacao == null)
            {
                return NotFound();
            }

            _context.Tipodocumentacoes.Remove(Tipodocumentacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
