using System.ComponentModel.DataAnnotations;

namespace Backend.Models.CreateModels
{
    public class PessoaCreateDTO
    {
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; } = null!;

        public string? Apelido { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Cnpjcpf { get; set; } = null!;

        public string? Telefone { get; set; }

        public string? Observacao { get; set; } = null!;

        public string? Rg { get; set; }

        public string? Email { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public bool Ehtecnico { get; set; }

        public string? Cfta { get; set; } = null!;

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int Tipo { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public PessoaEnderecoDTO Endereco { get; set; }
    }
}
