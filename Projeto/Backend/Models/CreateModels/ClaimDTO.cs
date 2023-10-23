namespace Backend.Models.CreateModels
{
    public class ClaimDTO
    {
        public string Tipo { get; set; } // O tipo da reivindicação
        public string UserId { get; set; } // O ID do usuário associado à reivindicação
        public string Valor { get; set; } // O valor da reivindicação
    }
}
