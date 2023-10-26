using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class PropostaDTO
    {
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

        public string Proponentenome { get; set; } = null!;

        public string Culturanome { get; set; } = null!;

        public string Tiponome { get; set; } = null!;
    }
}
