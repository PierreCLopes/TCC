using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOModels
{
    public class PropostaImovelDTO
    {
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public decimal Area { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Imovel { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Proposta { get; set; }

    }
}
