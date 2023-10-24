using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class TipoDocumentacaoDTO
    {
        public string Observacao { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Sigla { get; set; } = null!;
    }
}
