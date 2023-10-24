using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_FILIAL")]
public partial class Filial
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Observacao { get; set; } = null!;

    public int Pessoa { get; set; }

    public string Sigla { get; set; } = null!;

    [JsonIgnore]
    public virtual Pessoa PessoaNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Proposta> Proposta { get; set; } = new List<Proposta>();
}
