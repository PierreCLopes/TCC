using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class LogModel
    {
        public string? Logusuariocadastro { get; set; }

        public string? Logusuarioalteracao { get; set; }

        public DateTime Logdatacadastro { get; set; }

        public DateTime Logdataalteracao { get; set; }

        public virtual ApplicationUser? LogusuarioalteracaoNavigation { get; set; }

        public virtual ApplicationUser? LogusuariocadastroNavigation { get; set; }
    }
}
