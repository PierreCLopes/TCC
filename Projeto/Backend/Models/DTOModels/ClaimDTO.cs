using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class ClaimDTO
    {
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Tipo { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Valor { get; set; } 
    }
}
