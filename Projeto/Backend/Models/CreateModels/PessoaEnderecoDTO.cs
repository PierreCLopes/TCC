namespace Backend.Models.CreateModels
{
    public class PessoaEnderecoDTO
    {
        public string Observacao { get; set; } = null!;

        public string Complemento { get; set; } = null!;

        public int Numero { get; set; }

        public string Cep { get; set; } = null!;

        public string Bairro { get; set; } = null!;

        public int Cidade { get; set; }

        public int Pessoa { get; set; }
    }
}
