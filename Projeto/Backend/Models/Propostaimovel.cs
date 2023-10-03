using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("TB_PROPOSTAIMOVEL")]
public partial class Propostaimovel
{
    public int Id { get; set; }

    public decimal Area { get; set; }

    public int Imovel { get; set; }

    public int Proposta { get; set; }

    public virtual Imovel ImovelNavigation { get; set; } = null!;

    public virtual Proposta PropostaNavigation { get; set; } = null!;
}
