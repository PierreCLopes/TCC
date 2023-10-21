using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PESSOAENDERECO")]
public partial class Pessoaendereco
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public string Complemento { get; set; } = null!;

    public string Numero { get; set; } = null!;

    public string Cep { get; set; } = null!;

    public string Bairro { get; set; } = null!;

    public int Cidade { get; set; }

    public int Pessoa { get; set; }

    public virtual Cidade CidadeNavigation { get; set; } = null!;

    public virtual Pessoa PessoaNavigation { get; set; } = null!;
}
