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
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PessoaController : ControllerBase
    {
        private readonly Contexto _context;

        public PessoaController(Contexto context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null)
        {
            IQueryable<Pessoa> query = _context.Pessoas;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            //-- Pega o total de registros da base com o filtro de nome
            var totalCount = await query.CountAsync();

            //-- Pega os registros filtrando pelos query paramns
            var Pessoas = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Pessoas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> GetPessoa(int id)
        {
            var Pessoa = await _context.Pessoas.FindAsync(id);

            if (Pessoa == null)
            {
                return NotFound();
            }

            return Pessoa;
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(PessoaCreateDTO PessoaDTO)
        {
            var Pessoa = new Pessoa
            {
                Nome = PessoaDTO.Nome,
                Apelido = PessoaDTO.Apelido,
                Cfta = PessoaDTO.Cfta,
                Cnpjcpf = PessoaDTO.Cnpjcpf,
                Ehtecnico = PessoaDTO.Ehtecnico,
                Email = PessoaDTO.Email,    
                Rg = PessoaDTO.Rg,
                Telefone = PessoaDTO.Telefone,
                Tipo = PessoaDTO.Tipo,
                Observacao = PessoaDTO.Observacao
            };

            // Encontre a cidade relacionada com base no ID fornecido no DTO
            // Pessoa. = await _context.Cidades.FindAsync(PessoaDTO.Cidade);


            // Adicione o Pessoa ao contexto
            _context.Pessoas.Add(Pessoa);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPessoa", new { id = Pessoa.Id }, Pessoa);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutPessoa(int id, PessoaCreateDTO PessoaDTO)
        {
            var Pessoa = new Pessoa
            {
                Id = id,
                Nome = PessoaDTO.Nome,
                Apelido = PessoaDTO.Apelido,
                Cfta = PessoaDTO.Cfta,
                Cnpjcpf = PessoaDTO.Cnpjcpf,
                Ehtecnico = PessoaDTO.Ehtecnico,
                Email = PessoaDTO.Email,
                Rg = PessoaDTO.Rg,
                Telefone = PessoaDTO.Telefone,
                Tipo = PessoaDTO.Tipo,
                Observacao = PessoaDTO.Observacao
            };

            // Encontre a cidade relacionada com base no ID fornecido no DTO
            // Pessoa.CidadeNavigation = await _context.Cidades.FindAsync(PessoaDTO.Cidade);

            _context.Entry(Pessoa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PessoaExists(id))
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
        public async Task<IActionResult> DeletePessoa(int id)
        {
            var Pessoa = await _context.Pessoas.FindAsync(id);
            if (Pessoa == null)
            {
                return NotFound();
            }

            _context.Pessoas.Remove(Pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PessoaExists(int id)
        {
            return _context.Pessoas.Any(e => e.Id == id);
        }
    }
}
