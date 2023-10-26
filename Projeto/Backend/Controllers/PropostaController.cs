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
    public class PropostaController : ControllerBase
    {
        private readonly Contexto _context;

        public PropostaController(Contexto context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Proposta>>> GetPropostas(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nome = null)
        {
            IQueryable<Proposta> query = _context.Proposta;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.ProponenteNavigation.Apelido.Contains(nome));
            }

            var totalCount = await query.CountAsync();

            var Proposta = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new { p.Id,
                                   p.Data,
                                   proponentenome = p.ProponenteNavigation.Nome, 
                                   filialsigla = p.FilialNavigation.Sigla,
                                   culturanome = p.CulturaNavigation.Nome,
                                   tiponome = p.TipoNavigation.Nome})
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(Proposta);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PropostaDTO>> GetProposta(int id)
        {
            var Proposta = await _context.Proposta.FindAsync(id);

            if (Proposta == null)
            {
                return NotFound();
            }

            var PropostaDTO = new PropostaDTO
            {
                Areafinanciada = Proposta.Areafinanciada,
                Avalista = Proposta.Avalista,
                Carenciameses = Proposta.Carenciameses,
                Cultura = Proposta.Cultura, 
                Data = Proposta.Data,
                Datacolheita = Proposta.Datacolheita,
                Dataplantio = Proposta.Dataplantio,
                Ehastecfinanciada = Proposta.Ehastecfinanciada,
                Ehpossuilaudoacompanhamento = Proposta.Ehpossuilaudoacompanhamento,
                Filial = Proposta.Filial,
                Linhacredito = Proposta.Linhacredito,
                Numeroparcela = Proposta.Numeroparcela,
                Origemrecursoproprio = Proposta.Origemrecursoproprio,
                Prazomeses = Proposta.Prazomeses,
                Produtividadeesperada = Proposta.Produtividadeesperada,
                Produtividademedia = Proposta.Produtividademedia,
                Proponente = Proposta.Proponente,
                Responsaveltecnico = Proposta.Responsaveltecnico,
                Status = Proposta.Status,
                Taxajuros = Proposta.Taxajuros,
                Tipo = Proposta.Tipo,
                Valorastec = Proposta.Valorastec,
                Valortotalfinanciado = Proposta.Valortotalfinanciado,
                Valortotalfinanciamento = Proposta.Valortotalfinanciamento,
                Valortotalorcamento = Proposta.Valortotalorcamento,
                Valortotalrecursoproprio = Proposta.Valortotalrecursoproprio,
                Valorunitariofinanciamento = Proposta.Valorunitariofinanciamento,
                Vencimento = Proposta.Vencimento,
                Observacao = Proposta.Observacao
            };

            return PropostaDTO;
        }

        [HttpPost]
        public async Task<ActionResult<Proposta>> PostProposta(PropostaDTO PropostaDTO)
        {
            var Proposta = new Proposta
            {
                Areafinanciada = PropostaDTO.Areafinanciada,
                Avalista = PropostaDTO.Avalista,
                Carenciameses = PropostaDTO.Carenciameses,
                Cultura = PropostaDTO.Cultura,
                Data = PropostaDTO.Data,
                Datacolheita = PropostaDTO.Datacolheita,
                Dataplantio = PropostaDTO.Dataplantio,
                Ehastecfinanciada = PropostaDTO.Ehastecfinanciada,
                Ehpossuilaudoacompanhamento = PropostaDTO.Ehpossuilaudoacompanhamento,
                Filial = PropostaDTO.Filial,
                Linhacredito = PropostaDTO.Linhacredito,
                Numeroparcela = PropostaDTO.Numeroparcela,
                Origemrecursoproprio = PropostaDTO.Origemrecursoproprio,
                Prazomeses = PropostaDTO.Prazomeses,
                Produtividadeesperada = PropostaDTO.Produtividadeesperada,
                Produtividademedia = PropostaDTO.Produtividademedia,
                Proponente = PropostaDTO.Proponente,
                Responsaveltecnico = PropostaDTO.Responsaveltecnico,
                Status = StatusProposta.Cadastrada,
                Taxajuros = PropostaDTO.Taxajuros,
                Tipo = PropostaDTO.Tipo,
                Valorastec = PropostaDTO.Valorastec,
                Valortotalfinanciado = PropostaDTO.Valortotalfinanciado,
                Valortotalfinanciamento = PropostaDTO.Valortotalfinanciamento,
                Valortotalorcamento = PropostaDTO.Valortotalorcamento,
                Valortotalrecursoproprio = PropostaDTO.Valortotalrecursoproprio,
                Valorunitariofinanciamento = PropostaDTO.Valorunitariofinanciamento,
                Vencimento = PropostaDTO.Vencimento,
                Observacao = PropostaDTO.Observacao
            };

            // Adicione a Proposta ao contexto
            _context.Proposta.Add(Proposta);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProposta", new { id = Proposta.Id }, Proposta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProposta(int id, PropostaDTO PropostaDTO)
        {
            var Proposta = await _context.Proposta.FindAsync(id);

            if (Proposta == null)
            {
                return NotFound("Proposta não encontrada");
            }

            // Atualize as propriedades da instância existente de Proposta
            Proposta.Areafinanciada = PropostaDTO.Areafinanciada;
            Proposta.Avalista = PropostaDTO.Avalista;
            Proposta.Carenciameses = PropostaDTO.Carenciameses;
            Proposta.Cultura = PropostaDTO.Cultura;
            Proposta.Data = PropostaDTO.Data;
            Proposta.Datacolheita = PropostaDTO.Datacolheita;
            Proposta.Dataplantio = PropostaDTO.Dataplantio;
            Proposta.Ehastecfinanciada = PropostaDTO.Ehastecfinanciada;
            Proposta.Ehpossuilaudoacompanhamento = PropostaDTO.Ehpossuilaudoacompanhamento;
            Proposta.Filial = PropostaDTO.Filial;
            Proposta.Linhacredito = PropostaDTO.Linhacredito;
            Proposta.Numeroparcela = PropostaDTO.Numeroparcela;
            Proposta.Origemrecursoproprio = PropostaDTO.Origemrecursoproprio;
            Proposta.Prazomeses = PropostaDTO.Prazomeses;
            Proposta.Produtividadeesperada = PropostaDTO.Produtividadeesperada;
            Proposta.Produtividademedia = PropostaDTO.Produtividademedia;
            Proposta.Proponente = PropostaDTO.Proponente;
            Proposta.Responsaveltecnico = PropostaDTO.Responsaveltecnico;
            Proposta.Taxajuros = PropostaDTO.Taxajuros;
            Proposta.Tipo = PropostaDTO.Tipo;
            Proposta.Valorastec = PropostaDTO.Valorastec;
            Proposta.Valortotalfinanciado = PropostaDTO.Valortotalfinanciado;
            Proposta.Valortotalfinanciamento = PropostaDTO.Valortotalfinanciamento;
            Proposta.Valortotalorcamento = PropostaDTO.Valortotalorcamento;
            Proposta.Valortotalrecursoproprio = PropostaDTO.Valortotalrecursoproprio;
            Proposta.Valorunitariofinanciamento = PropostaDTO.Valorunitariofinanciamento;
            Proposta.Vencimento = PropostaDTO.Vencimento;
            Proposta.Observacao = PropostaDTO.Observacao;

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
        public async Task<IActionResult> DeleteProposta(int id)
        {
            var Proposta = await _context.Proposta.FindAsync(id);
            if (Proposta == null)
            {
                return NotFound();
            }

            _context.Proposta.Remove(Proposta);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
