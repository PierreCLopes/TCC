using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PROPOSTA")]
public partial class Proposta
{
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public int Cultura { get; set; }

    public int Proponente { get; set; }

    public int Responsaveltecnico { get; set; }

    public decimal Produtividademedia { get; set; }

    public decimal Produtividadeesperada { get; set; }

    public decimal Valortotalorcamento { get; set; }

    public decimal Valortotalfinanciamento { get; set; }

    public decimal Valortotalrecursoproprio { get; set; }

    public string Origemrecursoproprio { get; set; } = null!;

    public string Linhacredito { get; set; } = null!;

    public decimal Valorastec { get; set; }

    public bool Ehastecfinanciada { get; set; }

    public bool Ehpossuilaudoacompanhamento { get; set; }

    public decimal Valortotalfinanciado { get; set; }

    public int Prazomeses { get; set; }

    public int Numeroparcela { get; set; }

    public int Carenciameses { get; set; }

    public decimal Taxajuros { get; set; }

    public DateTime Data { get; set; }

    public DateTime Vencimento { get; set; }

    public int Avalista { get; set; }

    public decimal Areafinanciada { get; set; }

    public decimal Valorunitariofinanciamento { get; set; }

    public DateTime Dataplantio { get; set; }

    public DateTime Datacolheita { get; set; }

    public int Filial { get; set; }

    public int Status { get; set; }

    public int Tipo { get; set; }

    public virtual Pessoa AvalistaNavigation { get; set; } = null!;

    public virtual Cultura CulturaNavigation { get; set; } = null!;

    public virtual Filial FilialNavigation { get; set; } = null!;

    public virtual Pessoa ProponenteNavigation { get; set; } = null!;

    public virtual Pessoa ResponsaveltecnicoNavigation { get; set; } = null!;

    public virtual ICollection<Documentacao> Documentacoes { get; set; } = new List<Documentacao>();

    public virtual ICollection<Propostaimovel> Propostaimoveis { get; set; } = new List<Propostaimovel>();

    public virtual ICollection<Propostalaudo> Propostalaudos { get; set; } = new List<Propostalaudo>();

    public virtual Tipoproposta TipoNavigation { get; set; } = null!;
}
