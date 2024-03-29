﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models;

[Table("TB_CIDADE")]
public partial class Cidade
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public int Estado { get; set; }

    public int Codigoibge { get; set; }

    [JsonIgnore]
    public virtual Estado EstadoNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Imovel> Imoveis { get; set; } = new List<Imovel>();

    [JsonIgnore]
    public virtual ICollection<Pessoaendereco> Pessoaenderecos { get; set; } = new List<Pessoaendereco>();
}
