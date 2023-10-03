using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_TIPOPROPOSTA")]
public partial class Tipoproposta
{
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public string Nome { get; set; } = null!;

    public virtual ICollection<Proposta> Proposta { get; set; } = new List<Proposta>();

    public virtual ICollection<Tipopropostadocumentacao> Tipopropostadocumentacoes { get; set; } = new List<Tipopropostadocumentacao>();
}
