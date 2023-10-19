using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.CreateModels;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ImovelController : ControllerBase
    {
        private readonly Contexto _context;

        public ImovelController(Contexto context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Imovel>>> GetImoveis(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null)
        {
            IQueryable<Imovel> query = _context.Imoveis;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            //-- Pega o total de registros da base com o filtro de nome
            var totalCount = await query.CountAsync();

            //-- Pega os registros filtrando pelos query paramns
            var Imoveis = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Imoveis);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Imovel>> GetImovel(int id)
        {
            var Imovel = await _context.Imoveis.FindAsync(id);

            if (Imovel == null)
            {
                return NotFound();
            }

            return Imovel;
        }

        [HttpPost]
        public async Task<ActionResult<Imovel>> PostImovel(ImovelCreateDTO imovelDTO)
        {
            var imovel = new Imovel
            {
                Nome = imovelDTO.Nome,
                Areatotal = imovelDTO.Areatotal,
                Areaagricola = imovelDTO.Areaagricola,
                Areapastagem = imovelDTO.Areapastagem,
                Matricula = imovelDTO.Matricula,
                Latitude = imovelDTO.Latitude,
                Longitude = imovelDTO.Longitude,
                Roteiroacesso = imovelDTO.Roteiroacesso,
                Observacao = imovelDTO.Observacao
            };

            // Encontre a cidade relacionada com base no ID fornecido no DTO
            imovel.CidadeNavigation = await _context.Cidades.FindAsync(imovelDTO.Cidade);

            // Encontre o proprietário relacionado com base no ID fornecido no DTO
            imovel.ProprietarioNavigation = await _context.Pessoas.FindAsync(imovelDTO.Proprietario);

            // Adicione o Imovel ao contexto
            _context.Imoveis.Add(imovel);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetImovel", new { id = imovel.Id }, imovel);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutImovel(int id, ImovelCreateDTO imovelDTO)
        {
            var imovel = new Imovel
            {
                Id = id,
                Nome = imovelDTO.Nome,
                Areatotal = imovelDTO.Areatotal,
                Areaagricola = imovelDTO.Areaagricola,
                Areapastagem = imovelDTO.Areapastagem,
                Matricula = imovelDTO.Matricula,
                Latitude = imovelDTO.Latitude,
                Longitude = imovelDTO.Longitude,
                Roteiroacesso = imovelDTO.Roteiroacesso,
                Observacao = imovelDTO.Observacao
            };

            // Encontre a cidade relacionada com base no ID fornecido no DTO
            imovel.CidadeNavigation = await _context.Cidades.FindAsync(imovelDTO.Cidade);

            // Encontre o proprietário relacionado com base no ID fornecido no DTO
            imovel.ProprietarioNavigation = await _context.Pessoas.FindAsync(imovelDTO.Proprietario);

            _context.Entry(imovel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImovelExists(id))
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
        public async Task<IActionResult> DeleteImovel(int id)
        {
            var Imovel = await _context.Imoveis.FindAsync(id);
            if (Imovel == null)
            {
                return NotFound();
            }

            _context.Imoveis.Remove(Imovel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{imovelId}/uploadFile")]
        public async Task<IActionResult> UploadFile(int imovelId, [FromForm] IFormFile arquivokml)
        {
            if (arquivokml == null || arquivokml.Length == 0)
            {
                return BadRequest("Nenhum arquivo enviado.");
            }

            // Converta o arquivo em um array de bytes
            using (var memoryStream = new MemoryStream())
            {
                await arquivokml.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                // Salve o array de bytes na coluna BLOB do banco de dados
                // Certifique-se de associá-lo ao imóvel com o ID especificado
                // Exemplo de uso do Entity Framework Core:
                var imovel = await _context.Imoveis.FindAsync(imovelId);
                if (imovel != null)
                {
                    imovel.Arquivokml = fileBytes;
                    await _context.SaveChangesAsync();
                    return Ok("Arquivo enviado e salvo no banco de dados com sucesso.");
                }
                else
                {
                    return NotFound("Imóvel não encontrado.");
                }
            }
        }


        private bool ImovelExists(int id)
        {
            return _context.Imoveis.Any(e => e.Id == id);
        }
    }
}
