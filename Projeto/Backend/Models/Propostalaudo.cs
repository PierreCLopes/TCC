using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_PROPOSTALAUDO")]
public partial class Propostalaudo : LogModel
{
    public int Id { get; set; }

    public string Observacao { get; set; } = null!;

    public int Proposta { get; set; }

    public DateTime Datalaudo { get; set; }

    public string Datavistoria { get; set; } = null!;

    public int Sequencial { get; set; }

    public bool Ehareacultivadafinanciada { get; set; }

    public bool Ehlavouraplantadafinanciada { get; set; }

    public bool Ehcroquiidentificaarea { get; set; }

    public bool Ehpossuiarearecursoproprio { get; set; }

    public bool Ehepocaplantiozoneamento { get; set; }

    public bool Ehcreditoaplicadocorreto { get; set; }

    public bool Ehatendendorecomendacao { get; set; }

    public string Situacaoempreendimento { get; set; } = null!;

    public decimal Produtividadeplano { get; set; }

    public decimal Produtividadeobtida { get; set; }

    public string Status { get; set; } = null!;

    public virtual Proposta PropostaNavigation { get; set; } = null!;

    public virtual ICollection<Propostalaudodiagnostico> Propostalaudodiagnosticos { get; set; } = new List<Propostalaudodiagnostico>();
}
