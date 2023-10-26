using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class PessoaEnderecoDTO
    {
        public string Observacao { get; set; } = null!;

        public string Complemento { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Numero { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Cep { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Bairro { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Cidade { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Pessoa { get; set; }
    }
}
