using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PROPOSTALAUDODIAGNOSTICO")]
public partial class Propostalaudodiagnostico
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public bool Ehalterouprodutividade { get; set; }

    public bool Ehfazercontrole { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Propostalaudo { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Diagnostico { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Nivel { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public decimal Areaafetada { get; set; }

    [JsonIgnore]
    public virtual Propostalaudo PropostalaudoNavigation { get; set; } = null!;
}
