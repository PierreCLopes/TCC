using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models;

[Table("TB_IMOVEL")]
public partial class Imovel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Nome { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Proprietario { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Matricula { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public decimal Areatotal { get; set; }

    public string Latitude { get; set; } = null!;

    public string Longitude { get; set; } = null!;

    public decimal Areaagricola { get; set; }

    public decimal Areapastagem { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Cidade { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public string Roteiroacesso { get; set; } = null!;

    public byte[]? Arquivokml { get; set; }

    [JsonIgnore]
    public virtual Cidade CidadeNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Pessoa ProprietarioNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Documentacao> Documentacoes { get; set; } = new List<Documentacao>();

    [JsonIgnore]
    public virtual ICollection<Propostaimovel> Propostaimoveis { get; set; } = new List<Propostaimovel>();
}
