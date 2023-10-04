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
    public class CulturaController : ControllerBase
    {
        private readonly Contexto _context;

        public CulturaController(Contexto context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cultura>>> GetCulturas(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null)
        {
            IQueryable<Cultura> query = _context.Culturas;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            var culturas = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            //var totalCount = culturas.Count();

            //var response = new ApiResponse<List<Cultura>>(culturas, totalCount);

            return Ok(culturas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cultura>> GetCultura(int id)
        {
            var cultura = await _context.Culturas.FindAsync(id);

            if (cultura == null)
            {
                return NotFound();
            }

            return cultura;
        }

        [HttpPost]
        public async Task<ActionResult<Cultura>> PostCultura(Cultura cultura)
        {
            _context.Culturas.Add(cultura);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCultura", new { id = cultura.Id }, cultura);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCultura(int id, Cultura cultura)
        {
            if (id != cultura.Id)
            {
                return BadRequest();
            }

            _context.Entry(cultura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CulturaExists(id))
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
        public async Task<IActionResult> DeleteCultura(int id)
        {
            var cultura = await _context.Culturas.FindAsync(id);
            if (cultura == null)
            {
                return NotFound();
            }

            _context.Culturas.Remove(cultura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CulturaExists(int id)
        {
            return _context.Culturas.Any(e => e.Id == id);
        }
    }
}
