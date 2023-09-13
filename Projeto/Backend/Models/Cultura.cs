using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_CULTURA")]
public partial class Cultura : LogModel
{
    public int Id { get; set; }

    public decimal Precokg { get; set; }

    public string? Observacao { get; set; }

    public string Nome { get; set; } = null!;

    public virtual ICollection<Proposta> Proposta { get; set; } = new List<Proposta>();
}
