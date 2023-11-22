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
            [FromQuery] string? nome = null,
            [FromQuery] int? id = null)
        {
            IQueryable<Pessoa> query = _context.Pessoas;

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            var totalCount = await query.CountAsync();

            if (id.HasValue)
            {
                var PessoaById = await query.FirstOrDefaultAsync(p => p.Id == id);
                if (PessoaById != null)
                {
                    // Obtenha os registros da paginação, excluindo o registro do ID
                    var Pessoas = await query
                        .Where(p => p.Id != id)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

                    // Inclua o registro do ID na lista
                    Pessoas.Add(PessoaById);

                    Response.Headers.Add("X-Total-Count", (totalCount - 1).ToString());

                    return Ok(Pessoas);
                }
            }

            var pessoas = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());

            return Ok(pessoas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PessoaCreateDTO>> GetPessoa(int id)
        {
            var Pessoa = await _context.Pessoas.FindAsync(id);

            if (Pessoa == null)
            {
                return NotFound();
            }

            var Endereco = await _context.Pessoaenderecos.FirstOrDefaultAsync(e => e.Pessoa == Pessoa.Id);

            if (Endereco != null)
            {
                var PessoaDTO = new PessoaCreateDTO
                {
                    Nome = Pessoa.Nome,
                    Apelido = Pessoa.Apelido,
                    Cfta = Pessoa.Cfta,
                    Cnpjcpf = Pessoa.Cnpjcpf,
                    Ehtecnico = Pessoa.Ehtecnico,
                    Email = Pessoa.Email,
                    Rg = Pessoa.Rg,
                    Telefone = Pessoa.Telefone,
                    Tipo = Pessoa.Tipo,
                    Observacao = Pessoa.Observacao,
                    Endereco = new PessoaEnderecoDTO
                    {
                        Bairro = Endereco.Bairro,
                        Cep = Endereco.Cep,
                        Cidade = Endereco.Cidade,
                        Complemento = Endereco.Complemento,
                        Numero = Endereco.Numero,
                        Observacao = Endereco.Observacao
                    }
                };

                return PessoaDTO;
            }

            return NotFound();
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(PessoaCreateDTO pessoaDTO)
        {
            // Verifique se o tipo de pessoa é válido (1 para física, 2 para jurídica)
            if (pessoaDTO.Tipo != 1 && pessoaDTO.Tipo != 2)
            {
                var error = new ApiError(400, "Tipo de pessoa inválido. Use 1 para pessoa física ou 2 para pessoa jurídica.");
                return BadRequest(error);
            }

            // Valide o CNPJ/CPF com base no tipo de pessoa
            if ((pessoaDTO.Tipo == 1 && !ValidacaoHelper.IsCpf(pessoaDTO.Cnpjcpf)) ||
                (pessoaDTO.Tipo == 2 && !ValidacaoHelper.IsCnpj(pessoaDTO.Cnpjcpf)))
            {
                var error = new ApiError(400, "CNPJ/CPF inválido.");
                return BadRequest(error);
            }

            // Verifique se já existe uma pessoa com o mesmo CNPJ/CPF na base
            var pessoaExistente = await _context.Pessoas.FirstOrDefaultAsync(p => p.Cnpjcpf == pessoaDTO.Cnpjcpf);

            if (pessoaExistente != null)
            {
                var error = new ApiError(409, "Já existe uma pessoa com o mesmo CNPJ/CPF na base.");
                return Conflict(error);
            }

            var pessoa = new Pessoa
            {
                Nome = pessoaDTO.Nome,
                Apelido = pessoaDTO.Apelido,
                Cfta = pessoaDTO.Cfta,
                Cnpjcpf = pessoaDTO.Cnpjcpf,
                Ehtecnico = pessoaDTO.Ehtecnico,
                Email = pessoaDTO.Email,
                Rg = pessoaDTO.Rg,
                Telefone = pessoaDTO.Telefone,
                Tipo = pessoaDTO.Tipo,
                Observacao = pessoaDTO.Observacao
            };

            // Adicione a pessoa ao contexto
            _context.Pessoas.Add(pessoa);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            var endereco = new Pessoaendereco
            {
                Bairro = pessoaDTO.Endereco.Bairro,
                Cep = pessoaDTO.Endereco.Cep,
                Cidade = pessoaDTO.Endereco.Cidade,
                Complemento = pessoaDTO.Endereco.Complemento,
                Numero = pessoaDTO.Endereco.Numero,
                Observacao = pessoaDTO.Endereco.Observacao,
                Pessoa = pessoa.Id
            };

            // Adicione o Endereço ao contexto
            _context.Pessoaenderecos.Add(endereco);

            // Salve as alterações no contexto
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPessoa", new { id = pessoa.Id }, pessoa);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutPessoa(int id, PessoaCreateDTO pessoaDTO)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
            {
                return NotFound("Pessoa não encontrada");
            }

            // Verifique se o tipo de pessoa é válido (1 para física, 2 para jurídica)
            if (pessoaDTO.Tipo != 1 && pessoaDTO.Tipo != 2)
            {
                var error = new ApiError(400, "Tipo de pessoa inválido. Use 1 para pessoa física ou 2 para pessoa jurídica.");
                return BadRequest(error);
            }

            // Valide o CNPJ/CPF com base no tipo de pessoa
            if ((pessoaDTO.Tipo == 1 && !ValidacaoHelper.IsCpf(pessoaDTO.Cnpjcpf)) ||
                (pessoaDTO.Tipo == 2 && !ValidacaoHelper.IsCnpj(pessoaDTO.Cnpjcpf)))
            {
                var error = new ApiError(400, "CNPJ/CPF inválido.");
                return BadRequest(error);
            }

            // Verifique se já existe uma pessoa com o mesmo CNPJ/CPF na base
            var pessoaExistente = await _context.Pessoas.FirstOrDefaultAsync(p => p.Cnpjcpf == pessoaDTO.Cnpjcpf);

            if ((pessoaExistente != null) && (pessoaExistente.Id != id))
            {
                var error = new ApiError(409, "Já existe uma pessoa com o mesmo CNPJ/CPF na base.");
                return Conflict(error);
            }

            // Atualize as propriedades da instância existente de Pessoa
            pessoa.Nome = pessoaDTO.Nome;
            pessoa.Apelido = pessoaDTO.Apelido;
            pessoa.Cfta = pessoaDTO.Cfta;
            pessoa.Cnpjcpf = pessoaDTO.Cnpjcpf;
            pessoa.Ehtecnico = pessoaDTO.Ehtecnico;
            pessoa.Email = pessoaDTO.Email;
            pessoa.Rg = pessoaDTO.Rg;
            pessoa.Telefone = pessoaDTO.Telefone;
            pessoa.Tipo = pessoaDTO.Tipo;
            pessoa.Observacao = pessoaDTO.Observacao;

            var endereco = await _context.Pessoaenderecos.FirstOrDefaultAsync(e => e.Pessoa == pessoa.Id);

            if (endereco != null)
            {
                // Atualize as propriedades da instância existente de Pessoaendereco
                endereco.Bairro = pessoaDTO.Endereco.Bairro;
                endereco.Cep = pessoaDTO.Endereco.Cep;
                endereco.Cidade = pessoaDTO.Endereco.Cidade;
                endereco.Complemento = pessoaDTO.Endereco.Complemento;
                endereco.Numero = pessoaDTO.Endereco.Numero;
                endereco.Observacao = pessoaDTO.Endereco.Observacao;
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(int id)
        {
            // Verifique se existe alguma Documentacao vinculada a esta Pessoa
            var temDocumentacao = await _context.Documentacoes.AnyAsync(d => d.Pessoa == id);

            if (temDocumentacao)
            {
                var error = new ApiError(400, "Não é possível excluir a Pessoa, pois há Documentações vinculadas a ela.");
                return BadRequest(error);
            }

            var PropostaVinculada = await _context.Proposta.AnyAsync(p => (p.Avalista == id) ||
                                                                          (p.Proponente == id) ||
                                                                          (p.Responsaveltecnico == id) ||
                                                                          (p.Avalista == id));
            if (PropostaVinculada)
            {
                var error = new ApiError(400, "Não é possível excluir a Pessoa, pois ela está vinculada a uma proposta.");
                return BadRequest(error);
            }

            var FilialVinculada = await _context.Filiais.AnyAsync(f => f.Pessoa == id);
            if (FilialVinculada)
            {
                var error = new ApiError(400, "Não é possível excluir a Pessoa, pois ela está vinculada a uma filial.");
                return BadRequest(error);
            }

            var ImovelVinculado = await _context.Imoveis.AnyAsync(f => f.Proprietario == id);
            if (ImovelVinculado)
            {
                var error = new ApiError(400, "Não é possível excluir a Pessoa, pois ela está vinculada a um imóvel.");
                return BadRequest(error);
            }

            // Verifique e remova PessoaEndereco, se existir
            var PessoaEndereco = await _context.Pessoaenderecos.FirstOrDefaultAsync(e => e.Pessoa == id);
            if (PessoaEndereco != null)
            {
                _context.Pessoaenderecos.Remove(PessoaEndereco);
            }

            var Pessoa = await _context.Pessoas.FindAsync(id);
            if (Pessoa == null)
            {
                return NotFound();
            }

            _context.Pessoas.Remove(Pessoa);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return BadRequest(e.Message);
            }
            
            return NoContent();
        }


        private bool PessoaExists(int id)
        {
            return _context.Pessoas.Any(e => e.Id == id);
        }
    }
}
