using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_CULTURA")]
public partial class Cultura 
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public decimal Precokg { get; set; }

    public string? Observacao { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Nome { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Proposta> Proposta { get; set; } = new List<Proposta>();
}
