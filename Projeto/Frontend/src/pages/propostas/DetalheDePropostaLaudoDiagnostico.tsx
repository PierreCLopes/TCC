import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography, AlertColor, FormControlLabel, Button, Icon } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { PropostaLaudoDiagnosticoService } from "../../shared/services/api/propostas/PropostaLaudoDiagnosticoService";
import { VTextField, VForm, useVForm, IVFormErrors, VCheckBox } from "../../shared/forms";
import useUserPermissions from "../../shared/hooks/UseUserPermissions";

interface IFormData {
    areaafetada: number,
    nivel: string,
    diagnostico: string,
    observacao: string,
    ehalterouprodutividade: boolean,
    ehfazercontrole: boolean
}

const formValitationSchema: yup.Schema<IFormData> = yup.object({
    areaafetada: yup.number().required(),
    nivel: yup.string().required(),
    diagnostico: yup.string().required(),
    observacao: yup.string().default(''),
    ehalterouprodutividade: yup.boolean().default(false),
    ehfazercontrole: yup.boolean().default(false)
});

export const DetalheDePropostaLaudoDiagnostico: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'novo'} = useParams<'id'>();
    const {propostaid} = useParams<'propostaid'>();
    const {propostalaudoid} = useParams<'propostalaudoid'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Proposta');

    useEffect(() => {
        if (id !== 'novo'){    

            setIsLoading(true);

            PropostaLaudoDiagnosticoService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnosticos`);

                } else {
                    setNome(result.diagnostico);

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                ehalterouprodutividade: false,
                ehfazercontrole: false
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'novo'){
                    PropostaLaudoDiagnosticoService.create({propostalaudo: Number(propostalaudoid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnosticos`);
        
                            } else {
                                setAlertMessage('Registro criado com sucesso!');
                                setAlertSeverity("success");
                                navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnostico/${result.id}`);
                            }
                        }  
                    })
                } else {
                    PropostaLaudoDiagnosticoService.updateById(Number(id), {id: Number(id), propostalaudo: Number(propostaid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnosticos`);
        
                            } else {
                                setAlertMessage('Registro alterado com sucesso!');
                                setAlertSeverity("success");
                            }
                        }  
                    })
                }
            })
            .catch((errors: yup.ValidationError) => {
                
                setIsLoading(false);

                const validationErrors: IVFormErrors = {};

                errors.inner.forEach(error => {
                    if (!error.path) return;

                    validationErrors[error.path] = error.message;
                })
                
                formRef.current?.setErrors(validationErrors);
            });

        setIsLoading(true);

    };

    const handleDelete = (id: number) => {
        if(confirm('Deseja realmente excluir o laudo de acompanhamento?')){
            PropostaLaudoDiagnosticoService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    alert('Registro apagado com sucesso!');

                    navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnosticos`);
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'novo' ? 'Novo diagnóstico do laudo' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Novo"
                    mostrarBotaoSalvar={permissions?.Editar}
                    mostrarBotaoSalvarEFechar={permissions?.Editar}
                    mostrarBotaoNovo={id !== 'novo' && permissions?.Editar}
                    mostrarBotaoApagar={id !== 'novo' && permissions?.Excluir}
     
                    aoClicarEmApagar={() => {handleDelete(Number(id))}}
                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmNovo={() => {navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnostico/novo`)}}
                    aoClicarEmVoltar={() => {navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnosticos`)}}

                    mostrarBotaoSalvarCarregando={isLoading}
                    mostrarBotaoApagarCarregando={isLoading}
                    mostrarBotaoNovoCarregando={isLoading}
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

                        {isLoading &&(
                            <Grid item>
                            <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Geral</Typography>
                        </Grid>
                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Área afetada"
                                    placeholder="Área afetada" 
                                    name="areaafetada"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ha</InputAdornment>,
                                        inputMode: "decimal",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Nível"
                                    placeholder="Nível" 
                                    name="nivel"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <VTextField 
                                    fullWidth 
                                    label="Diagnóstico"
                                    placeholder="Diagnóstico" 
                                    name="diagnostico"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row">
                            <Grid item xs={12} md={3} lg={2}>
                                <FormControlLabel
                                    label="Alterou a produtividade?"
                                    control={
                                        <VCheckBox 
                                            name="ehalterouprodutividade"
                                            disabled={isLoading || !permissions?.Editar}
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={3} lg={2}>
                                <FormControlLabel
                                    label="Fazer controle?"
                                    control={
                                        <VCheckBox 
                                            name="ehfazercontrole"
                                            disabled={isLoading || !permissions?.Editar}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>          

                        <Grid container item direction="row">
                            <Grid item xs={12}>
                                <VTextField 
                                    fullWidth
                                    label="Observação"
                                    placeholder="Observação" 
                                    name="observacao"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                        </Grid>
                    </Grid> 
                </Box>
            </VForm>
        </LayoutBaseDePagina>
    );
};