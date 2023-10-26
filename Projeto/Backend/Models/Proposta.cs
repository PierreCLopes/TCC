using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PROPOSTA")]
public partial class Proposta
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Cultura { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
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

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Filial { get; set; }

    public int Status { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório")]
    public int Tipo { get; set; }

    [JsonIgnore]
    public virtual Pessoa AvalistaNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Cultura CulturaNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Filial FilialNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Pessoa ProponenteNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Pessoa ResponsaveltecnicoNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Documentacao> Documentacoes { get; set; } = new List<Documentacao>();

    [JsonIgnore]
    public virtual ICollection<Propostaimovel> Propostaimoveis { get; set; } = new List<Propostaimovel>();

    [JsonIgnore]
    public virtual ICollection<Propostalaudo> Propostalaudos { get; set; } = new List<Propostalaudo>();

    [JsonIgnore]
    public virtual Tipoproposta TipoNavigation { get; set; } = null!;
};

public static class StatusProposta
{
    public const int Cadastrada = 1;
    public const int AguardandoLaudosDeAcompanhamento = 2;
    public const int Encerrada = 3;
}
