using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TB_CULTURA",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PRECOKG = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: true),
                    NOME = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_CULTURA_PK", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TB_ESTADO",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    CODIGOIBGE = table.Column<int>(type: "int", nullable: false),
                    NOME = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    SIGLA = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_ESTADO_PK", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TB_PESSOA",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    NOME = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    APELIDO = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    CNPJCPF = table.Column<string>(type: "varchar(14)", unicode: false, maxLength: 14, nullable: false),
                    TELEFONE = table.Column<string>(type: "varchar(1)", unicode: false, maxLength: 1, nullable: true),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: true),
                    RG = table.Column<string>(type: "varchar(1)", unicode: false, maxLength: 1, nullable: true),
                    EMAIL = table.Column<string>(type: "varchar(1)", unicode: false, maxLength: 1, nullable: true),
                    EHTECNICO = table.Column<bool>(type: "bit", nullable: false),
                    CFTA = table.Column<string>(type: "varchar(11)", unicode: false, maxLength: 11, nullable: true),
                    TIPO = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_PESSOA_PK", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TB_TIPODOCUMENTACAO",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    NOME = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    SIGLA = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_TIPODOCUMENTACAO_PK", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TB_TIPOPROPOSTA",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    NOME = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_TIPOPROPOSTA_PK", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                });

            migrationBuilder.CreateTable(
                name: "TB_CIDADE",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    NOME = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    ESTADO = table.Column<int>(type: "int", nullable: false),
                    CODIGOIBGE = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_CIDADE_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_ESTADO_TB_CIDADE_fk",
                        column: x => x.ESTADO,
                        principalTable: "TB_ESTADO",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_FILIAL",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    NOME = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    PESSOA = table.Column<int>(type: "int", nullable: false),
                    SIGLA = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_FILIAL_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_PESSOA_TB_FILIAL_fk",
                        column: x => x.PESSOA,
                        principalTable: "TB_PESSOA",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_TIPOPROPOSTADOCUMENTACAO",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    TIPOPROPOSTA = table.Column<int>(type: "int", nullable: false),
                    TIPODOCUMENTACAO = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_TIPOPROPOSTADOCUMENTACAO_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_TIPODOCUMENTACAO_TB_TIPOPROPOSTADOCUMENTACAO_fk",
                        column: x => x.TIPODOCUMENTACAO,
                        principalTable: "TB_TIPODOCUMENTACAO",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_TIPOPROPOSTA_TB_TIPOPROPOSTADOCUMENTACAO_fk",
                        column: x => x.TIPOPROPOSTA,
                        principalTable: "TB_TIPOPROPOSTA",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_IMOVEL",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    NOME = table.Column<string>(type: "varchar(80)", unicode: false, maxLength: 80, nullable: false),
                    PROPRIETARIO = table.Column<int>(type: "int", nullable: false),
                    MATRICULA = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    AREATOTAL = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    LATITUDE = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    LONGITUDE = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    AREAAGRICOLA = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    AREAPASTAGEM = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    CIDADE = table.Column<int>(type: "int", nullable: false),
                    ROTEIROACESSO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    ARQUIVOKML = table.Column<byte[]>(type: "VARBINARY(MAX)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_IMOVEL_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_CIDADE_TB_IMOVEL_fk",
                        column: x => x.CIDADE,
                        principalTable: "TB_CIDADE",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PESSOA_TB_IMOVEL_fk",
                        column: x => x.PROPRIETARIO,
                        principalTable: "TB_PESSOA",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_PESSOAENDERECO",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    COMPLEMENTO = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    NUMERO = table.Column<int>(type: "int", nullable: false),
                    CEP = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    BAIRRO = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    CIDADE = table.Column<int>(type: "int", nullable: false),
                    PESSOA = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_PESSOAENDERECO_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_CIDADE_TB_PESSOAENDERECO_fk",
                        column: x => x.CIDADE,
                        principalTable: "TB_CIDADE",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PESSOA_TB_PESSOAENDERECO_fk",
                        column: x => x.PESSOA,
                        principalTable: "TB_PESSOA",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_PROPOSTA",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    CULTURA = table.Column<int>(type: "int", nullable: false),
                    PROPONENTE = table.Column<int>(type: "int", nullable: false),
                    RESPONSAVELTECNICO = table.Column<int>(type: "int", nullable: false),
                    PRODUTIVIDADEMEDIA = table.Column<decimal>(type: "decimal(15,0)", nullable: false),
                    PRODUTIVIDADEESPERADA = table.Column<decimal>(type: "decimal(15,0)", nullable: false),
                    VALORTOTALORCAMENTO = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    VALORTOTALFINANCIAMENTO = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    VALORTOTALRECURSOPROPRIO = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    ORIGEMRECURSOPROPRIO = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    LINHACREDITO = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    VALORASTEC = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    EHASTECFINANCIADA = table.Column<bool>(type: "bit", nullable: false),
                    EHPOSSUILAUDOACOMPANHAMENTO = table.Column<bool>(type: "bit", nullable: false),
                    VALORTOTALFINANCIADO = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    PRAZOMESES = table.Column<int>(type: "int", nullable: false),
                    NUMEROPARCELA = table.Column<int>(type: "int", nullable: false),
                    CARENCIAMESES = table.Column<int>(type: "int", nullable: false),
                    TAXAJUROS = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    DATA = table.Column<DateTime>(type: "datetime", nullable: false),
                    VENCIMENTO = table.Column<DateTime>(type: "datetime", nullable: false),
                    AVALISTA = table.Column<int>(type: "int", nullable: false),
                    AREAFINANCIADA = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    VALORUNITARIOFINANCIAMENTO = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    DATAPLANTIO = table.Column<DateTime>(type: "datetime", nullable: false),
                    DATACOLHEITA = table.Column<DateTime>(type: "datetime", nullable: false),
                    FILIAL = table.Column<int>(type: "int", nullable: false),
                    STATUS = table.Column<int>(type: "int", nullable: false),
                    TIPO = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_PROPOSTA_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_CULTURA_TB_PROPOSTA_fk",
                        column: x => x.CULTURA,
                        principalTable: "TB_CULTURA",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_FILIAL_TB_PROPOSTA_fk",
                        column: x => x.FILIAL,
                        principalTable: "TB_FILIAL",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PESSOA_TB_PROPOSTA_fk",
                        column: x => x.PROPONENTE,
                        principalTable: "TB_PESSOA",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PESSOA_TB_PROPOSTA_fk1",
                        column: x => x.RESPONSAVELTECNICO,
                        principalTable: "TB_PESSOA",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PESSOA_TB_PROPOSTA_fk2",
                        column: x => x.AVALISTA,
                        principalTable: "TB_PESSOA",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_TIPOPROPOSTA_TB_PROPOSTA_fk",
                        column: x => x.TIPO,
                        principalTable: "TB_TIPOPROPOSTA",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_DOCUMENTACAO",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    ARQUIVO = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    TIPO = table.Column<int>(type: "int", nullable: false),
                    PROPOSTA = table.Column<int>(type: "int", nullable: true),
                    IMOVEL = table.Column<int>(type: "int", nullable: true),
                    PESSOA = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_DOCUMENTACAO_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_IMOVEL_TB_DOCUMENTACAO_fk",
                        column: x => x.IMOVEL,
                        principalTable: "TB_IMOVEL",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PESSOA_TB_DOCUMENTACAO_fk",
                        column: x => x.PESSOA,
                        principalTable: "TB_PESSOA",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PROPOSTA_TB_DOCUMENTACAO_fk",
                        column: x => x.PROPOSTA,
                        principalTable: "TB_PROPOSTA",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_TIPODOCUMENTACAO_TB_DOCUMENTACAO_fk",
                        column: x => x.TIPO,
                        principalTable: "TB_TIPODOCUMENTACAO",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_PROPOSTAIMOVEL",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    AREA = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    IMOVEL = table.Column<int>(type: "int", nullable: false),
                    PROPOSTA = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_PROPOSTAIMOVEL_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_IMOVEL_TB_PROPOSTAIMOVEL_fk",
                        column: x => x.IMOVEL,
                        principalTable: "TB_IMOVEL",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "TB_PROPOSTA_TB_PROPOSTAIMOVEL_fk",
                        column: x => x.PROPOSTA,
                        principalTable: "TB_PROPOSTA",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_PROPOSTALAUDO",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    PROPOSTA = table.Column<int>(type: "int", nullable: false),
                    DATALAUDO = table.Column<DateTime>(type: "datetime", nullable: false),
                    DATAVISTORIA = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    SEQUENCIAL = table.Column<int>(type: "int", nullable: false),
                    EHAREACULTIVADAFINANCIADA = table.Column<bool>(type: "bit", nullable: false),
                    EHLAVOURAPLANTADAFINANCIADA = table.Column<bool>(type: "bit", nullable: false),
                    EHCROQUIIDENTIFICAAREA = table.Column<bool>(type: "bit", nullable: false),
                    EHPOSSUIAREARECURSOPROPRIO = table.Column<bool>(type: "bit", nullable: false),
                    EHEPOCAPLANTIOZONEAMENTO = table.Column<bool>(type: "bit", nullable: false),
                    EHCREDITOAPLICADOCORRETO = table.Column<bool>(type: "bit", nullable: false),
                    EHATENDENDORECOMENDACAO = table.Column<bool>(type: "bit", nullable: false),
                    SITUACAOEMPREENDIMENTO = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    PRODUTIVIDADEPLANO = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    PRODUTIVIDADEOBTIDA = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    STATUS = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_PROPOSTALAUDO_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_PROPOSTA_TB_PROPOSTAACOMPANHAMENTO_fk",
                        column: x => x.PROPOSTA,
                        principalTable: "TB_PROPOSTA",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "TB_PROPOSTALAUDODIAGNOSTICO",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    OBSERVACAO = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    EHALTEROUPRODUTIVIDADE = table.Column<bool>(type: "bit", nullable: false),
                    EHFAZERCONTROLE = table.Column<bool>(type: "bit", nullable: false),
                    PROPOSTALAUDO = table.Column<int>(type: "int", nullable: false),
                    Logusuariocadastro = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Logusuarioalteracao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DIAGNOSTICO = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    NIVEL = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    AREAAFETADA = table.Column<decimal>(type: "decimal(15,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TB_PROPOSTALAUDODIAGNOSTICO_PK", x => x.ID);
                    table.ForeignKey(
                        name: "TB_PROPOSTALAUDO_TB_PROPOSTALAUDODIAGNOSTICO_fk",
                        column: x => x.PROPOSTALAUDO,
                        principalTable: "TB_PROPOSTALAUDO",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TB_CIDADE_ESTADO",
                table: "TB_CIDADE",
                column: "ESTADO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_DOCUMENTACAO_IMOVEL",
                table: "TB_DOCUMENTACAO",
                column: "IMOVEL");

            migrationBuilder.CreateIndex(
                name: "IX_TB_DOCUMENTACAO_PESSOA",
                table: "TB_DOCUMENTACAO",
                column: "PESSOA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_DOCUMENTACAO_PROPOSTA",
                table: "TB_DOCUMENTACAO",
                column: "PROPOSTA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_DOCUMENTACAO_TIPO",
                table: "TB_DOCUMENTACAO",
                column: "TIPO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_FILIAL_PESSOA",
                table: "TB_FILIAL",
                column: "PESSOA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_IMOVEL_CIDADE",
                table: "TB_IMOVEL",
                column: "CIDADE");

            migrationBuilder.CreateIndex(
                name: "IX_TB_IMOVEL_PROPRIETARIO",
                table: "TB_IMOVEL",
                column: "PROPRIETARIO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PESSOAENDERECO_CIDADE",
                table: "TB_PESSOAENDERECO",
                column: "CIDADE");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PESSOAENDERECO_PESSOA",
                table: "TB_PESSOAENDERECO",
                column: "PESSOA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTA_AVALISTA",
                table: "TB_PROPOSTA",
                column: "AVALISTA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTA_CULTURA",
                table: "TB_PROPOSTA",
                column: "CULTURA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTA_FILIAL",
                table: "TB_PROPOSTA",
                column: "FILIAL");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTA_PROPONENTE",
                table: "TB_PROPOSTA",
                column: "PROPONENTE");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTA_RESPONSAVELTECNICO",
                table: "TB_PROPOSTA",
                column: "RESPONSAVELTECNICO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTA_TIPO",
                table: "TB_PROPOSTA",
                column: "TIPO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTAIMOVEL_IMOVEL",
                table: "TB_PROPOSTAIMOVEL",
                column: "IMOVEL");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTAIMOVEL_PROPOSTA",
                table: "TB_PROPOSTAIMOVEL",
                column: "PROPOSTA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTALAUDO_PROPOSTA",
                table: "TB_PROPOSTALAUDO",
                column: "PROPOSTA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PROPOSTALAUDODIAGNOSTICO_PROPOSTALAUDO",
                table: "TB_PROPOSTALAUDODIAGNOSTICO",
                column: "PROPOSTALAUDO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_TIPOPROPOSTADOCUMENTACAO_TIPODOCUMENTACAO",
                table: "TB_TIPOPROPOSTADOCUMENTACAO",
                column: "TIPODOCUMENTACAO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_TIPOPROPOSTADOCUMENTACAO_TIPOPROPOSTA",
                table: "TB_TIPOPROPOSTADOCUMENTACAO",
                column: "TIPOPROPOSTA");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "TB_DOCUMENTACAO");

            migrationBuilder.DropTable(
                name: "TB_PESSOAENDERECO");

            migrationBuilder.DropTable(
                name: "TB_PROPOSTAIMOVEL");

            migrationBuilder.DropTable(
                name: "TB_PROPOSTALAUDODIAGNOSTICO");

            migrationBuilder.DropTable(
                name: "TB_TIPOPROPOSTADOCUMENTACAO");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "TB_IMOVEL");

            migrationBuilder.DropTable(
                name: "TB_PROPOSTALAUDO");

            migrationBuilder.DropTable(
                name: "TB_TIPODOCUMENTACAO");

            migrationBuilder.DropTable(
                name: "TB_CIDADE");

            migrationBuilder.DropTable(
                name: "TB_PROPOSTA");

            migrationBuilder.DropTable(
                name: "TB_ESTADO");

            migrationBuilder.DropTable(
                name: "TB_CULTURA");

            migrationBuilder.DropTable(
                name: "TB_FILIAL");

            migrationBuilder.DropTable(
                name: "TB_TIPOPROPOSTA");

            migrationBuilder.DropTable(
                name: "TB_PESSOA");
        }
    }
}
