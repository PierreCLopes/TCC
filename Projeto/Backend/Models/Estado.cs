using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models;

[Table("TB_ESTADO")]
public partial class Estado
{
    public int Id { get; set; }

    public int Codigoibge { get; set; }

    public string Nome { get; set; } = null!;

    public string Sigla { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Cidade> Cidades { get; set; } = new List<Cidade>();
}
