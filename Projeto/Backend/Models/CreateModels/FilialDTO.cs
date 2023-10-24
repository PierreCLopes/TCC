using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class FilialDTO
    {
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; } = null!;

        public string Observacao { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Pessoa { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Sigla { get; set; } = null!;
    }
}
