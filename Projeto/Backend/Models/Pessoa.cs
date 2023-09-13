using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PESSOA")]
public partial class Pessoa : LogModel
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string? Apelido { get; set; }

    public string Cnpjcpf { get; set; } = null!;

    public string? Telefone { get; set; }

    public string Observacao { get; set; } = null!;

    public string? Rg { get; set; }

    public string? Email { get; set; }

    public bool Ehtecnico { get; set; }

    public string Cfta { get; set; } = null!;

    public int Tipo { get; set; }

    public virtual ICollection<Documentacao> Documentacoes { get; set; } = new List<Documentacao>();

    public virtual ICollection<Filial> Filiais { get; set; } = new List<Filial>();

    public virtual ICollection<Imovel> Imoveis { get; set; } = new List<Imovel>();

    public virtual ICollection<Pessoaendereco> Pessoaenderecos { get; set; } = new List<Pessoaendereco>();

    public virtual ICollection<Proposta> PropostaAvalistaNavigations { get; set; } = new List<Proposta>();

    public virtual ICollection<Proposta> PropostaProponenteNavigations { get; set; } = new List<Proposta>();

    public virtual ICollection<Proposta> PropostaResponsaveltecnicoNavigations { get; set; } = new List<Proposta>();
}
