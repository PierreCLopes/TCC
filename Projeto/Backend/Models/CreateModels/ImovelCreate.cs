namespace Backend.Models.CreateModels
{
    public class ImovelCreateDTO
    {
        public string Nome { get; set; }
        public decimal Areatotal { get; set; }
        public decimal Areaagricola { get; set; }
        public decimal Areapastagem { get; set; }
        public string Arquivokml { get; set; }
        public int Proprietario { get; set; }
        public int Cidade { get; set; }
        public string Matricula { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Roteiroacesso { get; set; }
        public string Observacao { get; set; }
    }

}
