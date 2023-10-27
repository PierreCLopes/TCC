using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models;

[Table("TB_PROPOSTAIMOVEL")]
public partial class Propostaimovel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public decimal Area { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Imovel { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Proposta { get; set; }

    [JsonIgnore]
    public virtual Imovel ImovelNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Proposta PropostaNavigation { get; set; } = null!;
}
