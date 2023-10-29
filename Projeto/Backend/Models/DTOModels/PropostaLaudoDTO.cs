namespace Backend.Models.DTOModels
{
    public class PropostaLaudoDTO
    {
        public string Observacao { get; set; } = null!;

        public int Proposta { get; set; }

        public DateTime Datalaudo { get; set; }

        public DateTime Datavistoria { get; set; } = null!;

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

        public int Status { get; set; }
    }
}
