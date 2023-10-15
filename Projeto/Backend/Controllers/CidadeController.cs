using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CidadeController : ControllerBase
    {
        private readonly Contexto _context;

        public CidadeController(Contexto context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cidade>>> GetCidades(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null,
            [FromQuery] int? id = null)
        {
            IQueryable<Cidade> query = _context.Cidades;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            var totalCount = await query.CountAsync();

            if (id.HasValue)
            {
                var cidadeById = await query.FirstOrDefaultAsync(p => p.Id == id);
                if (cidadeById != null)
                {
                    // Obtenha os registros da paginação, excluindo o registro do ID
                    var Cidades = await query
                        .Where(p => p.Id != id)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

                    // Inclua o registro do ID na lista
                    Cidades.Add(cidadeById);

                    Response.Headers.Add("X-Total-Count", (totalCount - 1).ToString());

                    return Ok(Cidades);
                }
            }

            var cidades = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(cidades);
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Cidade>> GetCidade(int id)
        {
            var Cidade = await _context.Cidades.FindAsync(id);

            if (Cidade == null)
            {
                return NotFound();
            }

            return Cidade;
        }

    }
}
