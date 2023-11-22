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
    public class DocumentacaoController : ControllerBase
    {
        private readonly Contexto _context;

        public DocumentacaoController(Contexto context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Documentacao>>> GetDocumentacoes(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null,
            [FromQuery] int? pessoa = null,
            [FromQuery] int? imovel = null,
            [FromQuery] int? proposta = null)
        {
            IQueryable<Documentacao> query = _context.Documentacoes;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            if (pessoa.HasValue)
            {
                query = query.Where(p => p.Pessoa == pessoa.Value);
            }
            else if (imovel.HasValue)
            {
                query = query.Where(p => p.Imovel == imovel.Value);
            }
            else if (proposta.HasValue)
            {
                query = query.Where(p => p.Proposta == proposta.Value);
            }

            var totalCount = await query.CountAsync();

            var Documentacoes = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Documentacoes);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentacaoDTO>> GetDocumentacao(int id)
        {
            var Documentacao = await _context.Documentacoes.FindAsync(id);

            if (Documentacao == null)
            {
                return NotFound();
            }

            var DocumentacaoDTO = new DocumentacaoDTO
            {
                Nome = Documentacao.Nome,
                Arquivo = Documentacao.Arquivo,
                Tipo = Documentacao.Tipo,
                Pessoa = Documentacao.Pessoa,
                Imovel = Documentacao.Imovel,
                Proposta = Documentacao.Proposta
            };

            return DocumentacaoDTO;
        }

        [HttpPost]
        public async Task<ActionResult<Documentacao>> PostDocumentacao([FromForm] IFormFile arquivo,
                                                                       [FromForm] string nome,
                                                                       [FromForm] int tipo,
                                                                       [FromForm] int? pessoa = null,
                                                                       [FromForm] int? imovel = null,
                                                                       [FromForm] int? proposta = null)
        {

            if (proposta != 0)
            {
                var Proposta = await _context.Proposta.FindAsync(proposta);
                if (Proposta == null)
                {
                    var error = new ApiError(404, "Proposta não encontrada.");
                    return NotFound(error);
                }

                if (Proposta.Status != StatusProposta.Cadastrada)
                {
                    var error = new ApiError(400, "Status inválido. A proposta precisa estar no status Cadastrada para a documentação ser cadastrada.");
                    return BadRequest(error);
                }
            }

            if (pessoa == 0)
            {
                pessoa = null;
            }

            if (imovel == 0)
            {
                imovel = null;
            }

            if (proposta == 0)
            {
                proposta = null;
            }

            if (arquivo == null || arquivo.Length == 0)
            {
                var error = new ApiError(400, "Nenhum arquivo enviado.");
                return BadRequest(error);
            }

            // Verifique a extensão do arquivo
            var allowedExtensions = new List<string> { ".png", ".jpg", ".pdf",".kml" };
            var fileExtension = Path.GetExtension(arquivo.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                var error = new ApiError(400, "A extensão do arquivo não é permitida.");
                return BadRequest(error);
            }

            // Converta o arquivo em um array de bytes
            using (var memoryStream = new MemoryStream())
            {
                await arquivo.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                var Documentacao = new Documentacao
                {
                    Nome = nome,
                    Arquivo = fileBytes,
                    Tipo = tipo,
                    Pessoa = pessoa,
                    Imovel = imovel,
                    Proposta = proposta
                };

                // Adicione a Documentacao ao contexto
                _context.Documentacoes.Add(Documentacao);

                // Salve as alterações no contexto
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetDocumentacao", new { id = Documentacao.Id }, Documentacao);
            }
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocumentacao(int id,
                                                         [FromForm] IFormFile arquivo,
                                                         [FromForm] string nome,
                                                         [FromForm] int tipo,
                                                         [FromForm] int? pessoa = null,
                                                         [FromForm] int? imovel = null,
                                                         [FromForm] int? proposta = null)
        {
            var Documentacao = await _context.Documentacoes.FindAsync(id);

            if (Documentacao == null)
            {
                return NotFound("Documentação não encontrada");
            }

            if (arquivo == null || arquivo.Length == 0)
            {
                var error = new ApiError(400, "Nenhum arquivo enviado.");
                return BadRequest(error);
            }

            // Verifique a extensão do arquivo
            var allowedExtensions = new List<string> { ".png", ".jpg", ".pdf", ".kml" };
            var fileExtension = Path.GetExtension(arquivo.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                var error = new ApiError(400, "A extensão do arquivo não é permitida.");
                return BadRequest(error);
            }

            if (proposta != 0)
            {
                var Proposta = await _context.Proposta.FindAsync(proposta);
                if (Proposta == null)
                {
                    var error = new ApiError(404, "Proposta não encontrada.");
                    return NotFound(error);
                }

                if (Proposta.Status != StatusProposta.Cadastrada)
                {
                    var error = new ApiError(400, "Status inválido. A proposta precisa estar no status Cadastrada para a documentação ser cadastrada.");
                    return BadRequest(error);
                }
            }

            if (pessoa == 0)
            {
                pessoa = null;
            }

            if (imovel == 0)
            {
                imovel = null;
            }

            if (proposta == 0)
            {
                proposta = null;
            }

            // Converta o arquivo em um array de bytes
            using (var memoryStream = new MemoryStream())
            {
                await arquivo.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                // Atualize as propriedades da instância existente de Documentacao
                Documentacao.Nome = nome;
                Documentacao.Tipo = tipo;
                Documentacao.Arquivo = fileBytes;
                Documentacao.Pessoa = pessoa;
                Documentacao.Proposta = proposta;
                Documentacao.Imovel = imovel;

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
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocumentacao(int id)
        {
            var Documentacao = await _context.Documentacoes.FindAsync(id);
            if (Documentacao == null)
            {
                return NotFound();
            }

            if (Documentacao.Proposta != null)
            {
                var Proposta = await _context.Proposta.FindAsync(Documentacao.Proposta);
                if (Proposta == null)
                {
                    var error = new ApiError(404, "Proposta não encontrada.");
                    return NotFound(error);
                }

                if (Proposta.Status != StatusProposta.Cadastrada)
                {
                    var error = new ApiError(400, "Status inválido. A proposta precisa estar no status Cadastrada para a documentação ser cadastrada.");
                    return BadRequest(error);
                }
            }

            _context.Documentacoes.Remove(Documentacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
