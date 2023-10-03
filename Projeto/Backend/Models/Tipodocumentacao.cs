using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_TIPODOCUMENTACAO")]
public partial class Tipodocumentacao
{
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public string Nome { get; set; } = null!;

    public string Sigla { get; set; } = null!;

    public virtual ICollection<Documentacao> Documentacoes { get; set; } = new List<Documentacao>();

    public virtual ICollection<Tipopropostadocumentacao> Tipopropostadocumentacoes { get; set; } = new List<Tipopropostadocumentacao>();
}
