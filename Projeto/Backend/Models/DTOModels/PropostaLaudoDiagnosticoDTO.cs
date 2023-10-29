using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOModels
{
    public class PropostaLaudoDiagnosticoDTO
    {
        public string Observacao { get; set; } = null!;

        public bool Ehalterouprodutividade { get; set; }

        public bool Ehfazercontrole { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Propostalaudo { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Diagnostico { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nivel { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public decimal Areaafetada { get; set; }
    }
}
