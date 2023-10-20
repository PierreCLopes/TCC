using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_TIPOPROPOSTADOCUMENTACAO")]
public partial class Tipopropostadocumentacao
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int Tipoproposta { get; set; }

    public int Tipodocumentacao { get; set; }

    public virtual Tipodocumentacao TipodocumentacaoNavigation { get; set; } = null!;

    public virtual Tipoproposta TipopropostaNavigation { get; set; } = null!;
}
