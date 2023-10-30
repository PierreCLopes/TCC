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
    public class FilialController : ControllerBase
    {
        private readonly Contexto _context;

        public FilialController(Contexto context)
        {
            _context = context;
        }

        [ClaimsAuthorize("Filial", "Visualizar")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Filial>>> GetFilials(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null,
            [FromQuery] int? id = null)
        {
            IQueryable<Filial> query = _context.Filiais;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            var totalCount = await query.CountAsync();

            if (id.HasValue)
            {
                var FilialById = await query.FirstOrDefaultAsync(p => p.Id == id);
                if (FilialById != null)
                {
                    // Obtenha os registros da paginação, excluindo o registro do ID
                    var Filiais = await query
                        .Where(p => p.Id != id)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

                    // Inclua o registro do ID na lista
                    Filiais.Add(FilialById);

                    Response.Headers.Add("X-Total-Count", (totalCount - 1).ToString());

                    return Ok(Filiais);
                }
            }

            var filiais = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(filiais);
        }

        [ClaimsAuthorize("Filial", "Visualizar")]
        [HttpGet("{id}")]
        public async Task<ActionResult<FilialDTO>> GetFilial(int id)
        {
            var Filial = await _context.Filiais.FindAsync(id);

            if (Filial == null)
            {
                return NotFound();
            }

            var FilialDTO = new FilialDTO
            {
                Nome = Filial.Nome,
                Sigla = Filial.Sigla,
                Pessoa = Filial.Pessoa,
                Observacao = Filial.Observacao
            };

            return FilialDTO;
        }

        [ClaimsAuthorize("Filial", "Editar")]
        [HttpPost]
        public async Task<ActionResult<Filial>> PostFilial(FilialDTO FilialDTO)
        {
            var pessoa = await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == FilialDTO.Pessoa);

            if (pessoa == null)
            {
                var error = new ApiError(400, "A pessoa informada na Filial não foi encontrada.");
                return BadRequest(error);
            }

            // Verifique se o tipo de Filial é válido (1 para física, 2 para jurídica)
            if (pessoa.Tipo != 2)
            {
                var error = new ApiError(400, "Tipo de Pessoa inválido. O tipo de pessoa da filial deve ser jurídica.");
                return BadRequest(error);
            }

            // Verifique se já existe uma Filial com o mesmo CNPJ/CPF na base
            var FilialExistente = await _context.Filiais.FirstOrDefaultAsync(f => f.Nome == FilialDTO.Nome);

            if (FilialExistente != null)
            {
                var error = new ApiError(409, "Já existe uma Filial com o mesmo Nome cadastrada.");
                return Conflict(error);
            }

            var Filial = new Filial
            {
                Nome = FilialDTO.Nome,
                Sigla = FilialDTO.Sigla,
                Pessoa = FilialDTO.Pessoa,
                Observacao = FilialDTO.Observacao
            };

            // Adicione a Filial ao contexto
            _context.Filiais.Add(Filial);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFilial", new { id = Filial.Id }, Filial);
        }

        [ClaimsAuthorize("Filial", "Editar")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFilial(int id, FilialDTO FilialDTO)
        {
            var Filial = await _context.Filiais.FindAsync(id);

            if (Filial == null)
            {
                return NotFound("Filial não encontrada");
            }

            var pessoa = await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == FilialDTO.Pessoa);

            // Verifique se a pessoa da filial é jurídica
            if (pessoa.Tipo != 2)
            {
                var error = new ApiError(400, "Tipo de Pessoa inválido. O tipo de pessoa da filial deve ser jurídica.");
                return BadRequest(error);
            }

            // Verifique se já existe uma Filial com o mesmo nome na base
            var FilialExistente = await _context.Filiais.FirstOrDefaultAsync(f => f.Nome == FilialDTO.Nome);

            if ((FilialExistente != null) && (FilialExistente.Id != Filial.Id))
            {
                var error = new ApiError(409, "Já existe uma Filial com o mesmo Nome cadastrada.");
                return Conflict(error);
            }

            // Atualize as propriedades da instância existente de Filial
            Filial.Nome = FilialDTO.Nome;
            Filial.Sigla = FilialDTO.Sigla;
            Filial.Pessoa = FilialDTO.Pessoa;
            Filial.Observacao = FilialDTO.Observacao;

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

        [ClaimsAuthorize("Filial", "Excluir")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilial(int id)
        {
            var Filial = await _context.Filiais.FindAsync(id);
            if (Filial == null)
            {
                return NotFound();
            }

            _context.Filiais.Remove(Filial);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
