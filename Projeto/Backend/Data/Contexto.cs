using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public partial class Contexto : IdentityDbContext
    {
        public Contexto(DbContextOptions<Contexto> options) : base(options)
        {

        }

        public DbSet<Cidade> Cidades { get; set; }

        public DbSet<Cultura> Culturas { get; set; }

        public DbSet<Documentacao> Documentacoes { get; set; }

        public DbSet<Estado> Estados { get; set; }

        public DbSet<Filial> Filiais { get; set; }

        public DbSet<Imovel> Imoveis { get; set; }

        public DbSet<Pessoa> Pessoas { get; set; }

        public DbSet<Pessoaendereco> Pessoaenderecos { get; set; }

        public DbSet<Propostaimovel> Propostaimoveis { get; set; }

        public DbSet<Propostalaudo> Propostalaudos { get; set; }

        public DbSet<Propostalaudodiagnostico> Propostalaudodiagnosticos { get; set; }

        public DbSet<Proposta> Proposta { get; set; }

        public DbSet<Tipodocumentacao> Tipodocumentacoes { get; set; }

        public DbSet<Tipopropostadocumentacao> Tipopropostadocumentacoes { get; set; }

        public DbSet<Tipoproposta> Tipoproposta { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure primary keys for Identity Framework entities

            modelBuilder.Entity<IdentityUser>(entity =>
            {
                entity.HasKey(u => u.Id);
            });

            modelBuilder.Entity<IdentityRole>(entity =>
            {
                entity.HasKey(r => r.Id);
            });

            modelBuilder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.HasKey(uc => uc.Id);
            });

            modelBuilder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.HasKey(ur => new { ur.UserId, ur.RoleId });
            });

            modelBuilder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.HasKey(ul => new { ul.LoginProvider, ul.ProviderKey });
            });

            modelBuilder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.HasKey(rc => rc.Id);
            });

            modelBuilder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.HasKey(ut => new { ut.UserId, ut.LoginProvider, ut.Name });
            });

            modelBuilder.Entity<Cidade>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_CIDADE_PK");

                entity.ToTable("TB_CIDADE");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Estado).HasColumnName("ESTADO");
                entity.Property(e => e.Nome)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Codigoibge).HasColumnName("CODIGOIBGE");

                entity.HasOne(d => d.EstadoNavigation).WithMany(p => p.Cidades)
                    .HasForeignKey(d => d.Estado)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_ESTADO_TB_CIDADE_fk");
            });

            modelBuilder.Entity<Cultura>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_CULTURA_PK");

                entity.ToTable("TB_CULTURA");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .UseIdentityColumn();
                entity.Property(e => e.Nome)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Precokg)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("PRECOKG");
            });

            modelBuilder.Entity<Documentacao>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_DOCUMENTACAO_PK");

                entity.ToTable("TB_DOCUMENTACAO");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Arquivo)
                    .IsUnicode(false)
                    .HasColumnName("ARQUIVO");
                entity.Property(e => e.Imovel).HasColumnName("IMOVEL");
                entity.Property(e => e.Pessoa).HasColumnName("PESSOA");
                entity.Property(e => e.Proposta).HasColumnName("PROPOSTA");
                entity.Property(e => e.Tipo).HasColumnName("TIPO");

                entity.HasOne(d => d.ImovelNavigation).WithMany(p => p.Documentacoes)
                    .HasForeignKey(d => d.Imovel)
                    .HasConstraintName("TB_IMOVEL_TB_DOCUMENTACAO_fk");

                entity.HasOne(d => d.PessoaNavigation).WithMany(p => p.Documentacoes)
                    .HasForeignKey(d => d.Pessoa)
                    .HasConstraintName("TB_PESSOA_TB_DOCUMENTACAO_fk");

                entity.HasOne(d => d.PropostaNavigation).WithMany(p => p.Documentacoes)
                    .HasForeignKey(d => d.Proposta)
                    .HasConstraintName("TB_PROPOSTA_TB_DOCUMENTACAO_fk");

                entity.HasOne(d => d.TipoNavigation).WithMany(p => p.Documentacoes)
                    .HasForeignKey(d => d.Tipo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_TIPODOCUMENTACAO_TB_DOCUMENTACAO_fk");
            });

            modelBuilder.Entity<Estado>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_ESTADO_PK");

                entity.ToTable("TB_ESTADO");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Codigoibge).HasColumnName("CODIGOIBGE");
                entity.Property(e => e.Nome)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Sigla)
                    .IsUnicode(false)
                    .HasColumnName("SIGLA");
            });

            modelBuilder.Entity<Filial>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_FILIAL_PK");

                entity.ToTable("TB_FILIAL");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Nome)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Pessoa).HasColumnName("PESSOA");
                entity.Property(e => e.Sigla)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("SIGLA");

                entity.HasOne(d => d.PessoaNavigation).WithMany(p => p.Filiais)
                    .HasForeignKey(d => d.Pessoa)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PESSOA_TB_FILIAL_fk");
            });

            modelBuilder.Entity<Imovel>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_IMOVEL_PK");

                entity.ToTable("TB_IMOVEL");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .UseIdentityColumn();
                entity.Property(e => e.Areaagricola)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("AREAAGRICOLA");
                entity.Property(e => e.Areapastagem)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("AREAPASTAGEM");
                entity.Property(e => e.Areatotal)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("AREATOTAL");
                entity.Property(e => e.Arquivokml)
                      .HasColumnType("VARBINARY(MAX)")
                      .HasColumnName("ARQUIVOKML");
                entity.Property(e => e.Cidade).HasColumnName("CIDADE");
                entity.Property(e => e.Latitude)
                    .IsUnicode(false)
                    .HasColumnName("LATITUDE");
                entity.Property(e => e.Longitude)
                    .IsUnicode(false)
                    .HasColumnName("LONGITUDE");
                entity.Property(e => e.Matricula)
                    .IsUnicode(false)
                    .HasColumnName("MATRICULA");
                entity.Property(e => e.Nome)
                    .HasMaxLength(80)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Proprietario).HasColumnName("PROPRIETARIO");
                entity.Property(e => e.Roteiroacesso)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("ROTEIROACESSO");

                entity.HasOne(d => d.CidadeNavigation).WithMany(p => p.Imoveis)
                    .HasForeignKey(d => d.Cidade)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_CIDADE_TB_IMOVEL_fk");

                entity.HasOne(d => d.ProprietarioNavigation).WithMany(p => p.Imoveis)
                    .HasForeignKey(d => d.Proprietario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PESSOA_TB_IMOVEL_fk");
            });

            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_PESSOA_PK");

                entity.ToTable("TB_PESSOA");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Apelido)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APELIDO");
                entity.Property(e => e.Cfta)
                    .HasMaxLength(11)
                    .IsUnicode(false)
                    .HasColumnName("CFTA");
                entity.Property(e => e.Cnpjcpf)
                    .HasMaxLength(14)
                    .IsUnicode(false)
                    .HasColumnName("CNPJCPF");
                entity.Property(e => e.Ehtecnico).HasColumnName("EHTECNICO");
                entity.Property(e => e.Email)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("EMAIL");
                entity.Property(e => e.Nome)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Rg)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("RG");
                entity.Property(e => e.Telefone)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("TELEFONE");
                entity.Property(e => e.Tipo).HasColumnName("TIPO");
            });

            modelBuilder.Entity<Pessoaendereco>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_PESSOAENDERECO_PK");

                entity.ToTable("TB_PESSOAENDERECO");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Bairro)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("BAIRRO");
                entity.Property(e => e.Cep)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("CEP");
                entity.Property(e => e.Cidade).HasColumnName("CIDADE");
                entity.Property(e => e.Complemento)
                    .HasMaxLength(60)
                    .IsUnicode(false)
                    .HasColumnName("COMPLEMENTO");
                entity.Property(e => e.Numero).HasColumnName("NUMERO");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Pessoa).HasColumnName("PESSOA");

                entity.HasOne(d => d.CidadeNavigation).WithMany(p => p.Pessoaenderecos)
                    .HasForeignKey(d => d.Cidade)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_CIDADE_TB_PESSOAENDERECO_fk");

                entity.HasOne(d => d.PessoaNavigation).WithMany(p => p.Pessoaenderecos)
                    .HasForeignKey(d => d.Pessoa)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PESSOA_TB_PESSOAENDERECO_fk");
            });

            modelBuilder.Entity<Propostaimovel>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_PROPOSTAIMOVEL_PK");

                entity.ToTable("TB_PROPOSTAIMOVEL");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Area)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("AREA");
                entity.Property(e => e.Imovel).HasColumnName("IMOVEL");
                entity.Property(e => e.Proposta).HasColumnName("PROPOSTA");

                entity.HasOne(d => d.ImovelNavigation).WithMany(p => p.Propostaimoveis)
                    .HasForeignKey(d => d.Imovel)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_IMOVEL_TB_PROPOSTAIMOVEL_fk");

                entity.HasOne(d => d.PropostaNavigation).WithMany(p => p.Propostaimoveis)
                    .HasForeignKey(d => d.Proposta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PROPOSTA_TB_PROPOSTAIMOVEL_fk");
            });

            modelBuilder.Entity<Propostalaudo>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_PROPOSTALAUDO_PK");

                entity.ToTable("TB_PROPOSTALAUDO");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Datalaudo)
                    .HasColumnType("datetime")
                    .HasColumnName("DATALAUDO");
                entity.Property(e => e.Datavistoria)
                    .IsUnicode(false)
                    .HasColumnName("DATAVISTORIA");
                entity.Property(e => e.Ehareacultivadafinanciada).HasColumnName("EHAREACULTIVADAFINANCIADA");
                entity.Property(e => e.Ehatendendorecomendacao).HasColumnName("EHATENDENDORECOMENDACAO");
                entity.Property(e => e.Ehcreditoaplicadocorreto).HasColumnName("EHCREDITOAPLICADOCORRETO");
                entity.Property(e => e.Ehcroquiidentificaarea).HasColumnName("EHCROQUIIDENTIFICAAREA");
                entity.Property(e => e.Ehepocaplantiozoneamento).HasColumnName("EHEPOCAPLANTIOZONEAMENTO");
                entity.Property(e => e.Ehlavouraplantadafinanciada).HasColumnName("EHLAVOURAPLANTADAFINANCIADA");
                entity.Property(e => e.Ehpossuiarearecursoproprio).HasColumnName("EHPOSSUIAREARECURSOPROPRIO");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Produtividadeobtida)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("PRODUTIVIDADEOBTIDA");
                entity.Property(e => e.Produtividadeplano)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("PRODUTIVIDADEPLANO");
                entity.Property(e => e.Proposta).HasColumnName("PROPOSTA");
                entity.Property(e => e.Sequencial).HasColumnName("SEQUENCIAL");
                entity.Property(e => e.Situacaoempreendimento)
                    .IsUnicode(false)
                    .HasColumnName("SITUACAOEMPREENDIMENTO");
                entity.Property(e => e.Status)
                    .IsUnicode(false)
                    .HasColumnName("STATUS");

                entity.HasOne(d => d.PropostaNavigation).WithMany(p => p.Propostalaudos)
                    .HasForeignKey(d => d.Proposta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PROPOSTA_TB_PROPOSTAACOMPANHAMENTO_fk");
            });

            modelBuilder.Entity<Propostalaudodiagnostico>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_PROPOSTALAUDODIAGNOSTICO_PK");

                entity.ToTable("TB_PROPOSTALAUDODIAGNOSTICO");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Areaafetada)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("AREAAFETADA");
                entity.Property(e => e.Diagnostico)
                    .IsUnicode(false)
                    .HasColumnName("DIAGNOSTICO");
                entity.Property(e => e.Ehalterouprodutividade).HasColumnName("EHALTEROUPRODUTIVIDADE");
                entity.Property(e => e.Ehfazercontrole).HasColumnName("EHFAZERCONTROLE");
                entity.Property(e => e.Nivel)
                    .IsUnicode(false)
                    .HasColumnName("NIVEL");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Propostalaudo).HasColumnName("PROPOSTALAUDO");


                entity.HasOne(d => d.PropostalaudoNavigation).WithMany(p => p.Propostalaudodiagnosticos)
                    .HasForeignKey(d => d.Propostalaudo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PROPOSTALAUDO_TB_PROPOSTALAUDODIAGNOSTICO_fk");
            });

            modelBuilder.Entity<Proposta>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_PROPOSTA_PK");

                entity.ToTable("TB_PROPOSTA");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Areafinanciada)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("AREAFINANCIADA");
                entity.Property(e => e.Avalista).HasColumnName("AVALISTA");
                entity.Property(e => e.Carenciameses).HasColumnName("CARENCIAMESES");
                entity.Property(e => e.Cultura).HasColumnName("CULTURA");
                entity.Property(e => e.Data)
                    .HasColumnType("datetime")
                    .HasColumnName("DATA");
                entity.Property(e => e.Datacolheita)
                    .HasColumnType("datetime")
                    .HasColumnName("DATACOLHEITA");
                entity.Property(e => e.Dataplantio)
                    .HasColumnType("datetime")
                    .HasColumnName("DATAPLANTIO");
                entity.Property(e => e.Ehastecfinanciada).HasColumnName("EHASTECFINANCIADA");
                entity.Property(e => e.Ehpossuilaudoacompanhamento).HasColumnName("EHPOSSUILAUDOACOMPANHAMENTO");
                entity.Property(e => e.Filial).HasColumnName("FILIAL");
                entity.Property(e => e.Linhacredito)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("LINHACREDITO");
                entity.Property(e => e.Numeroparcela).HasColumnName("NUMEROPARCELA");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Origemrecursoproprio)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("ORIGEMRECURSOPROPRIO");
                entity.Property(e => e.Prazomeses).HasColumnName("PRAZOMESES");
                entity.Property(e => e.Produtividadeesperada)
                    .HasColumnType("decimal(15, 0)")
                    .HasColumnName("PRODUTIVIDADEESPERADA");
                entity.Property(e => e.Produtividademedia)
                    .HasColumnType("decimal(15, 0)")
                    .HasColumnName("PRODUTIVIDADEMEDIA");
                entity.Property(e => e.Proponente).HasColumnName("PROPONENTE");
                entity.Property(e => e.Responsaveltecnico).HasColumnName("RESPONSAVELTECNICO");
                entity.Property(e => e.Status).HasColumnName("STATUS");
                entity.Property(e => e.Taxajuros)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("TAXAJUROS");
                entity.Property(e => e.Tipo).HasColumnName("TIPO");
                entity.Property(e => e.Valorastec)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("VALORASTEC");
                entity.Property(e => e.Valortotalfinanciado)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("VALORTOTALFINANCIADO");
                entity.Property(e => e.Valortotalfinanciamento)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("VALORTOTALFINANCIAMENTO");
                entity.Property(e => e.Valortotalorcamento)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("VALORTOTALORCAMENTO");
                entity.Property(e => e.Valortotalrecursoproprio)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("VALORTOTALRECURSOPROPRIO");
                entity.Property(e => e.Valorunitariofinanciamento)
                    .HasColumnType("decimal(15, 2)")
                    .HasColumnName("VALORUNITARIOFINANCIAMENTO");
                entity.Property(e => e.Vencimento)
                    .HasColumnType("datetime")
                    .HasColumnName("VENCIMENTO");

                entity.HasOne(d => d.AvalistaNavigation).WithMany(p => p.PropostaAvalistaNavigations)
                    .HasForeignKey(d => d.Avalista)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PESSOA_TB_PROPOSTA_fk2");

                entity.HasOne(d => d.CulturaNavigation).WithMany(p => p.Proposta)
                    .HasForeignKey(d => d.Cultura)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_CULTURA_TB_PROPOSTA_fk");

                entity.HasOne(d => d.FilialNavigation).WithMany(p => p.Proposta)
                    .HasForeignKey(d => d.Filial)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_FILIAL_TB_PROPOSTA_fk");

                entity.HasOne(d => d.ProponenteNavigation).WithMany(p => p.PropostaProponenteNavigations)
                    .HasForeignKey(d => d.Proponente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PESSOA_TB_PROPOSTA_fk");

                entity.HasOne(d => d.ResponsaveltecnicoNavigation).WithMany(p => p.PropostaResponsaveltecnicoNavigations)
                    .HasForeignKey(d => d.Responsaveltecnico)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_PESSOA_TB_PROPOSTA_fk1");

                entity.HasOne(d => d.TipoNavigation).WithMany(p => p.Proposta)
                    .HasForeignKey(d => d.Tipo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_TIPOPROPOSTA_TB_PROPOSTA_fk");
            });

            modelBuilder.Entity<Tipodocumentacao>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_TIPODOCUMENTACAO_PK");

                entity.ToTable("TB_TIPODOCUMENTACAO");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Nome)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
                entity.Property(e => e.Sigla)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("SIGLA");
            });

            modelBuilder.Entity<Tipopropostadocumentacao>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_TIPOPROPOSTADOCUMENTACAO_PK");

                entity.ToTable("TB_TIPOPROPOSTADOCUMENTACAO");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Tipodocumentacao).HasColumnName("TIPODOCUMENTACAO");
                entity.Property(e => e.Tipoproposta).HasColumnName("TIPOPROPOSTA");

                entity.HasOne(d => d.TipodocumentacaoNavigation).WithMany(p => p.Tipopropostadocumentacoes)
                    .HasForeignKey(d => d.Tipodocumentacao)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_TIPODOCUMENTACAO_TB_TIPOPROPOSTADOCUMENTACAO_fk");

                entity.HasOne(d => d.TipopropostaNavigation).WithMany(p => p.Tipopropostadocumentacoes)
                    .HasForeignKey(d => d.Tipoproposta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TB_TIPOPROPOSTA_TB_TIPOPROPOSTADOCUMENTACAO_fk");
            });

            modelBuilder.Entity<Tipoproposta>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("TB_TIPOPROPOSTA_PK");

                entity.ToTable("TB_TIPOPROPOSTA");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");
                entity.Property(e => e.Nome)
                    .IsUnicode(false)
                    .HasColumnName("NOME");
                entity.Property(e => e.Observacao)
                    .HasMaxLength(4000)
                    .IsUnicode(false)
                    .HasColumnName("OBSERVACAO");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
