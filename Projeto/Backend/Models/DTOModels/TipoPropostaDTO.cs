using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class TipoPropostaDTO
    {
        public string Observacao { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; } = null!;

        public int[] TipoDocumentacaoObrigatoria { get; set; } = null!;
    }
}
