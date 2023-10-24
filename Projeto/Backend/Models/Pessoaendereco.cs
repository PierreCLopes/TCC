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

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Numero { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Cep { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Bairro { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Cidade { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Pessoa { get; set; }

    public virtual Cidade CidadeNavigation { get; set; } = null!;

    public virtual Pessoa PessoaNavigation { get; set; } = null!;
}
