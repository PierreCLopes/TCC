using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PROPOSTALAUDODIAGNOSTICO")]
public partial class Propostalaudodiagnostico : LogModel
{
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public bool Ehalterouprodutividade { get; set; }

    public bool Ehfazercontrole { get; set; }

    public int Propostalaudo { get; set; }

    public string? Logusuariocadastro { get; set; }

    public string? Logusuarioalteracao { get; set; }

    public string Diagnostico { get; set; } = null!;

    public string Nivel { get; set; } = null!;

    public decimal Areaafetada { get; set; }

    public virtual Propostalaudo PropostalaudoNavigation { get; set; } = null!;
}
