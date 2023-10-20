namespace Backend.Models.CreateModels
{
    public class PessoaCreateDTO
    {
        public string Nome { get; set; } = null!;

        public string? Apelido { get; set; }

        public string Cnpjcpf { get; set; } = null!;

        public string? Telefone { get; set; }

        public string? Observacao { get; set; } = null!;

        public string? Rg { get; set; }

        public string? Email { get; set; }

        public bool Ehtecnico { get; set; }

        public string? Cfta { get; set; } = null!;

        public int Tipo { get; set; }
    }
}
