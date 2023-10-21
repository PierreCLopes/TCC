﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.CreateModels;
using System.Text.RegularExpressions;

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

        // Função para validar CPF
        private bool ValidateCPF(string cpf)
        {
            // Lógica de validação do CPF aqui
            // Retorna true se válido, false se inválido
            // Exemplo de validação simples:
            return Regex.IsMatch(cpf, @"^\d{3}\.\d{3}\.\d{3}-\d{2}$");
        }

        // Função para validar CNPJ
        private bool ValidateCNPJ(string cnpj)
        {
            // Lógica de validação do CNPJ aqui
            // Retorna true se válido, false se inválido
            // Exemplo de validação simples:
            return Regex.IsMatch(cnpj, @"^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$");
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(PessoaCreateDTO pessoaDTO)
        {
            // Verifique se o tipo de pessoa é válido (1 para física, 2 para jurídica)
            if (pessoaDTO.Tipo != 1 && pessoaDTO.Tipo != 2)
            {
                return BadRequest("Tipo de pessoa inválido. Use 1 para pessoa física ou 2 para pessoa jurídica.");
            }

            // Valide o CNPJ/CPF com base no tipo de pessoa
            if ((pessoaDTO.Tipo == 1 && !ValidateCPF(pessoaDTO.Cnpjcpf)) ||
                (pessoaDTO.Tipo == 2 && !ValidateCNPJ(pessoaDTO.Cnpjcpf)))
            {
                return BadRequest("CNPJ/CPF inválido.");
            }

            // Verifique se já existe uma pessoa com o mesmo CNPJ/CPF na base
            var pessoaExistente = await _context.Pessoas.FirstOrDefaultAsync(p => p.Cnpjcpf == pessoaDTO.Cnpjcpf);

            if (pessoaExistente != null)
            {
                return Conflict("Já existe uma pessoa com o mesmo CNPJ/CPF na base.");
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
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PessoaExists(int id)
        {
            return _context.Pessoas.Any(e => e.Id == id);
        }
    }
}
