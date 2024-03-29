﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.CreateModels;
using DemoToken;

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

        [ClaimsAuthorize("Imovel", "Visualizar")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Imovel>>> GetImoveis(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null,
            [FromQuery] int? id = null)
        {
            IQueryable<Imovel> query = _context.Imoveis;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            //-- Pega o total de registros da base com o filtro de nome
            var totalCount = await query.CountAsync();

            if (id.HasValue)
            {
                var ImovelById = await query.FirstOrDefaultAsync(i => i.Id == id);
                if (ImovelById != null)
                {
                    // Obtenha os registros da paginação, excluindo o registro do ID
                    var imoveis = await query
                        .Where(p => p.Id != id)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

                    // Inclua o registro do ID na lista
                    imoveis.Add(ImovelById);

                    Response.Headers.Add("X-Total-Count", (totalCount - 1).ToString());

                    return Ok(imoveis);
                }
            }

            //-- Pega os registros filtrando pelos query paramns
            var Imoveis = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Imoveis);
        }

        [ClaimsAuthorize("Imovel", "Visualizar")]
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

        [ClaimsAuthorize("Imovel", "Editar")]
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

        [ClaimsAuthorize("Imovel", "Editar")]
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

        [ClaimsAuthorize("Imovel", "Excluir")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImovel(int id)
        {
            var ImovelProposta = await _context.Propostaimoveis.AnyAsync(i => i.Imovel == id);
            if (ImovelProposta)
            {
                var error = new ApiError(400, "Não é possível excluir o imóvel, pois ele está vinculado a um imóvel da proposta.");
                return BadRequest(error);
            }

            var Imovel = await _context.Imoveis.FindAsync(id);
            if (Imovel == null)
            {
                return NotFound();
            }

            _context.Imoveis.Remove(Imovel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [ClaimsAuthorize("Imovel", "Editar")]
        [HttpPost("{imovelId}/uploadFile")]
        public async Task<IActionResult> UploadFile(int imovelId, [FromForm] IFormFile arquivokml)
        {
            if (arquivokml == null || arquivokml.Length == 0)
            {
                var error = new ApiError(400, "Nenhum arquivo enviado.");
                return BadRequest(error);
            }

            // Verifique a extensão do arquivo
            var allowedExtensions = new List<string> { ".png", ".jpg", ".mp4", ".pdf", ".ico", ".rar", ".rtf", ".txt", ".srt", ".kml" };
            var fileExtension = Path.GetExtension(arquivokml.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                var error = new ApiError(400, "A extensão do arquivo não é permitida.");
                return BadRequest(error);
            }

            // Converta o arquivo em um array de bytes
            using (var memoryStream = new MemoryStream())
            {
                await arquivokml.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                // Salve o array de bytes na coluna BLOB do banco de dados
                // Certifique-se de associá-lo ao imóvel com o ID especificado
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
