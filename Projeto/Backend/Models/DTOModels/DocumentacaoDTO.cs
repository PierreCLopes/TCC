using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class DocumentacaoDTO
    {
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public byte[]? Arquivo { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Tipo { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; } = null!;

        public int? Proposta { get; set; }

        public int? Imovel { get; set; }

        public int? Pessoa { get; set; }
    }
}
