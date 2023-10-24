using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_TIPODOCUMENTACAO")]
public partial class Tipodocumentacao
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Nome { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Sigla { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Documentacao> Documentacoes { get; set; } = new List<Documentacao>();

    [JsonIgnore]
    public virtual ICollection<Tipopropostadocumentacao> Tipopropostadocumentacoes { get; set; } = new List<Tipopropostadocumentacao>();
}
