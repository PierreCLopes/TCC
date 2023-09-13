using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models;

[Table("TB_DOCUMENTACAO")]
public partial class Documentacao : LogModel
{
    public int Id { get; set; }

    public string Arquivo { get; set; } = null!;

    public int Tipo { get; set; }

    public int? Proposta { get; set; }

    public int? Imovel { get; set; }

    public int? Pessoa { get; set; }

    public virtual Imovel? ImovelNavigation { get; set; }

    public virtual Pessoa? PessoaNavigation { get; set; }

    public virtual Proposta? PropostaNavigation { get; set; }

    public virtual Tipodocumentacao TipoNavigation { get; set; } = null!;
}
