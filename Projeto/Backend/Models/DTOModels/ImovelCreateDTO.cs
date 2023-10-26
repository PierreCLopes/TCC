using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class ImovelCreateDTO
    {
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public decimal Areatotal { get; set; }

        public decimal Areaagricola { get; set; }

        public decimal Areapastagem { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Proprietario { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Cidade { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Matricula { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Roteiroacesso { get; set; }

        public string Observacao { get; set; }
    }

}
