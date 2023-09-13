using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("TB_IMOVEL")]
public partial class Imovel : LogModel
{
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public string Nome { get; set; } = null!;

    public int Proprietario { get; set; }

    public string Matricula { get; set; } = null!;

    public decimal Areatotal { get; set; }

    public string Latitude { get; set; } = null!;

    public string Longitude { get; set; } = null!;

    public decimal Areaagricola { get; set; }

    public decimal Areapastagem { get; set; }

    public int Cidade { get; set; }

    public string Roteiroacesso { get; set; } = null!;

    public string Arquivokml { get; set; } = null!;

    public virtual Cidade CidadeNavigation { get; set; } = null!;

    public virtual Pessoa ProprietarioNavigation { get; set; } = null!;

    public virtual ICollection<Documentacao> Documentacoes { get; set; } = new List<Documentacao>();

    public virtual ICollection<Propostaimovel> Propostaimoveis { get; set; } = new List<Propostaimovel>();
}
