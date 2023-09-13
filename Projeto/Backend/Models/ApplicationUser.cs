using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<Cultura> CulturaLogusuarioalteracaoNavigations { get; set; } = new List<Cultura>();

        public virtual ICollection<Cultura> CulturaLogusuariocadastroNavigations { get; set; } = new List<Cultura>();

        public virtual ICollection<Documentacao> DocumentacaoLogusuarioalteracaoNavigations { get; set; } = new List<Documentacao>();

        public virtual ICollection<Documentacao> DocumentacaoLogusuariocadastroNavigations { get; set; } = new List<Documentacao>();

        public virtual ICollection<Filial> FilialLogusuarioalteracaoNavigations { get; set; } = new List<Filial>();

        public virtual ICollection<Filial> FilialLogusuariocadastroNavigations { get; set; } = new List<Filial>();

        public virtual ICollection<Imovel> ImovelLogusuarioalteracaoNavigations { get; set; } = new List<Imovel>();

        public virtual ICollection<Imovel> ImovelLogusuariocadastroNavigations { get; set; } = new List<Imovel>();

        public virtual ICollection<Pessoa> PessoaLogusuarioalteracaoNavigations { get; set; } = new List<Pessoa>();

        public virtual ICollection<Pessoa> PessoaLogusuariocadastroNavigations { get; set; } = new List<Pessoa>();

        public virtual ICollection<Pessoaendereco> PessoaenderecoLogusuarioalteracaoNavigations { get; set; } = new List<Pessoaendereco>();

        public virtual ICollection<Pessoaendereco> PessoaenderecoLogusuariocadastroNavigations { get; set; } = new List<Pessoaendereco>();

        public virtual ICollection<Propostaimovel> PropostaimovelLogusuarioalteracaoNavigations { get; set; } = new List<Propostaimovel>();

        public virtual ICollection<Propostaimovel> PropostaimovelLogusuariocadastroNavigations { get; set; } = new List<Propostaimovel>();

        public virtual ICollection<Propostalaudo> PropostalaudoLogusuarioalteracaoNavigations { get; set; } = new List<Propostalaudo>();

        public virtual ICollection<Propostalaudo> PropostalaudoLogusuariocadastroNavigations { get; set; } = new List<Propostalaudo>();

        public virtual ICollection<Propostalaudodiagnostico> PropostalaudodiagnosticoLogusuarioalteracaoNavigations { get; set; } = new List<Propostalaudodiagnostico>();

        public virtual ICollection<Propostalaudodiagnostico> PropostalaudodiagnosticoLogusuariocadastroNavigations { get; set; } = new List<Propostalaudodiagnostico>();

        public virtual ICollection<Proposta> PropostaLogusuarioalteracaoNavigations { get; set; } = new List<Proposta>();

        public virtual ICollection<Proposta> PropostaLogusuariocadastroNavigations { get; set; } = new List<Proposta>();

        public virtual ICollection<Tipodocumentacao> TipodocumentacaoLogusuarioalteracaoNavigations { get; set; } = new List<Tipodocumentacao>();

        public virtual ICollection<Tipodocumentacao> TipodocumentacaoLogusuariocadastroNavigations { get; set; } = new List<Tipodocumentacao>();

        public virtual ICollection<Tipopropostadocumentacao> TipopropostadocumentacaoLogusuarioalteracaoNavigations { get; set; } = new List<Tipopropostadocumentacao>();

        public virtual ICollection<Tipopropostadocumentacao> TipopropostadocumentacaoLogusuariocadastroNavigations { get; set; } = new List<Tipopropostadocumentacao>();

        public virtual ICollection<Tipoproposta> TipopropostaLogusuarioalteracaoNavigations { get; set; } = new List<Tipoproposta>();

        public virtual ICollection<Tipoproposta> TipopropostaLogusuariocadastroNavigations { get; set; } = new List<Tipoproposta>();
    }
}
