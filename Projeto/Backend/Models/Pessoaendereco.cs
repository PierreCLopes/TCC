using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PESSOAENDERECO")]
public partial class Pessoaendereco : LogModel
{
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public string Complemento { get; set; } = null!;

    public int Numero { get; set; }

    public string Cep { get; set; } = null!;

    public string Bairro { get; set; } = null!;

    public int Cidade { get; set; }

    public int Pessoa { get; set; }

    public virtual Cidade CidadeNavigation { get; set; } = null!;

    public virtual Pessoa PessoaNavigation { get; set; } = null!;
}
