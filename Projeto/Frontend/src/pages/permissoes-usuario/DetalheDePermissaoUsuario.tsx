import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, Checkbox, Typography, AlertColor, FormControlLabel } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { VTextField, VForm, useVForm, IVFormErrors, VSelectField } from "../../shared/forms";
import { AutoCompleteUsuario } from "../../shared/components/auto-complete/AutoCompleteUsuario";
import { PermissaoUsuarioService } from "../../shared/services/api/permissoes-usuario/PermissaoUsuarioService";

interface IFormData {
    userId: string;
    tipo: string;
    valor: string;
}

const formValitationSchema: yup.Schema<IFormData> = yup.object({
    userId: yup.string().required(),
    tipo: yup.string().required(),
    valor: yup.string().default(''),
});

export const DetalheDePermissaoUsuario: React.FC = () => {
    const navigate = useNavigate();
    const { tipo = '' } = useParams<'tipo'>();
    const { userId = '' } = useParams<'userId'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info");

    const [valor, setValor] = useState("");

    useEffect(() => {
        setIsLoading(true);

        PermissaoUsuarioService.getById(userId, tipo)
            .then((result) => {

                setIsLoading(false);

                if (result instanceof Error) {
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate(`/usuario/${userId}`);

                } else {
                    console.log(result);

                    formRef.current?.setData(result);
                    setValor(result.valor);
                }
            });
    }, []);

    const handleSave = (dados: IFormData) => {
        dados.valor = valor;

        console.log(dados);
        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                PermissaoUsuarioService.updateById(userId, dadosValidados.tipo, dadosValidados)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
                        } else {
                            if (isSaveAndClose()) {
                                navigate(`/usuario/${userId}/permissoes`);
                            } else {
                                setAlertMessage('Registro alterado com sucesso!');
                                setAlertSeverity("success");
                            }
                        }
                    });
            })
            .catch((errors: yup.ValidationError) => {
                setIsLoading(false);
                const validationErrors: IVFormErrors = {};
                errors.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });
                formRef.current?.setErrors(validationErrors);
            });
        setIsLoading(true);
    };

    const handleCheckBoxChange = (acao: string) => {
        const valorArray = valor.split(",");

        if (valorArray.includes(acao)) {
            valorArray.splice(valorArray.indexOf(acao), 1);
        } else {
            valorArray.push(acao);
        }

        const novaAcoes = valorArray.join(",");
        setValor(novaAcoes);
    };

    const isCheckBoxChecked = (acao: string) => {
        return valor.split(",").includes(acao);
    };

    return (
        <LayoutBaseDePagina
            titulo={`Permissão de usuário`}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={false}
                    mostrarBotaoApagar={false}

                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmVoltar={() => { navigate(`/usuario/${userId}/permissoes`) }}

                    mostrarBotaoSalvarCarregando={isLoading}
                    mostrarBotaoSalvarEFecharCarregando={isLoading}
                />
            }
            alertMessage={alertMessage}
            alertSeverity={alertSeverity}
            onCloseAlert={() => setAlertMessage('')}
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
                    <Grid container direction="column" padding={2} spacing={2}>

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate" />
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Geral</Typography>
                        </Grid>
                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={6}>
                                <AutoCompleteUsuario
                                    disabled
                                    label="Usuário"
                                    isExternalLoading={false}
                                    nomeField="userId"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <VTextField
                                    fullWidth
                                    label="Tipo"
                                    placeholder="Tipo"
                                    name="tipo"
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    label="Visualizar"
                                    control={
                                        <Checkbox 
                                            checked={isCheckBoxChecked("Visualizar")}
                                            onChange={() => handleCheckBoxChange("Visualizar")}
                                            disabled={isLoading}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label="Excluir"
                                    control={
                                        <Checkbox 
                                            checked={isCheckBoxChecked("Excluir")}
                                            onChange={() => handleCheckBoxChange("Excluir")}
                                            disabled={isLoading}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label="Editar"
                                    control={
                                        <Checkbox 
                                            checked={isCheckBoxChecked("Editar")}
                                            onChange={() => handleCheckBoxChange("Editar")}
                                            disabled={isLoading}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </VForm>
        </LayoutBaseDePagina>
    );
};
