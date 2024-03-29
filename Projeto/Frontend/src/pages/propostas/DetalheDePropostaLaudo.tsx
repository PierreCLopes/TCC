import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography, AlertColor, FormControlLabel, Button, Icon } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { PropostaLaudoService } from "../../shared/services/api/propostas/PropostaLaudoService";
import { VTextField, VForm, useVForm, IVFormErrors, VCheckBox } from "../../shared/forms";
import useUserPermissions from "../../shared/hooks/UseUserPermissions";
import { StatusPropostaLaudo } from "../../shared/environment";

interface IFormData {
    datalaudo?: Date,
    datavistoria?: Date,
    ehareacultivadafinanciada?: boolean,
    ehcreditoaplicadocorreto?: boolean,
    ehatendendorecomendacao?: boolean,
    ehcroquiidentificaarea?: boolean,
    ehepocaplantiozoneamento?: boolean,
    ehlavouraplantadafinanciada?: boolean,
    ehpossuiarearecursoproprio?: boolean,
    observacao?: string,
    produtividadeobtida?: number,
    produtividadeplano?: number,
    situacaoempreendimento?: string,
    sequencial: number,
}

const formValitationSchema: yup.Schema<IFormData> = yup.object({
    datalaudo: yup.date().required(),
    datavistoria: yup.date().required(),
    ehareacultivadafinanciada: yup.boolean(),
    ehcreditoaplicadocorreto: yup.boolean(),
    ehatendendorecomendacao: yup.boolean(),
    ehcroquiidentificaarea: yup.boolean(),
    ehepocaplantiozoneamento: yup.boolean(),
    ehlavouraplantadafinanciada: yup.boolean(),
    ehpossuiarearecursoproprio: yup.boolean(),
    observacao: yup.string(),
    produtividadeobtida: yup.number(),
    produtividadeplano: yup.number(),
    situacaoempreendimento: yup.string(),
    sequencial: yup.number().default(0),
});

const formValitationSchemaLiberar: yup.Schema<IFormData> = yup.object({
    datalaudo: yup.date().required(),
    datavistoria: yup.date().required(),
    ehareacultivadafinanciada: yup.boolean(),
    ehcreditoaplicadocorreto: yup.boolean(),
    ehatendendorecomendacao: yup.boolean(),
    ehcroquiidentificaarea: yup.boolean(),
    ehepocaplantiozoneamento: yup.boolean(),
    ehlavouraplantadafinanciada: yup.boolean(),
    ehpossuiarearecursoproprio: yup.boolean(),
    observacao: yup.string(),
    produtividadeobtida: yup.number().moreThan(0),
    produtividadeplano: yup.number().moreThan(0),
    situacaoempreendimento: yup.string().required(),
    sequencial: yup.number().default(0),
});

export const DetalheDePropostaLaudo: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'novo'} = useParams<'id'>();
    const {propostaid} = useParams<'propostaid'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [nome, setNome] = useState('');
    const [status, setStatus] = useState(0);

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Proposta');

    useEffect(() => {
        if (id !== 'novo'){    

            setIsLoading(true);

            PropostaLaudoService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate(`/proposta/${propostaid}/propostalaudos`);

                } else {
                    setNome('Laudo de acompanhamento Seq.' + result.sequencial);

                    formRef.current?.setData(result);
                    setStatus(Number(result.status));
                }
            })
        } else {
            formRef.current?.setData({
                ehareacultivadafinanciada: false,
                ehcreditoaplicadocorreto: false,
                ehatendendorecomendacao: false,
                ehcroquiidentificaarea: false,
                ehepocaplantiozoneamento: false,
                ehlavouraplantadafinanciada: false,
                ehpossuiarearecursoproprio: false,
                observacao: "",
                situacaoempreendimento: "",
            });
            setStatus(StatusPropostaLaudo.Cadastrado);
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'novo'){
                    PropostaLaudoService.create({proposta: Number(propostaid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate(`/proposta/${propostaid}/propostalaudos`);
        
                            } else {
                                setAlertMessage('Registro criado com sucesso!');
                                setAlertSeverity("success");
                                navigate(`/proposta/${propostaid}/propostalaudo/${result.id}`);
                                setIsChanging(false);
                            }
                        }  
                    })
                } else {
                    PropostaLaudoService.updateById(Number(id), {id: Number(id), proposta: Number(propostaid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate(`/proposta/${propostaid}/propostalaudos`);
        
                            } else {
                                setAlertMessage('Registro alterado com sucesso!');
                                setAlertSeverity("success");
                                setIsChanging(false);
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
    };

    const handleDelete = (id: number) => {
        if(confirm('Deseja realmente excluir o laudo de acompanhamento?')){
            PropostaLaudoService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    alert('Registro apagado com sucesso!');

                    navigate(`/proposta/${propostaid}/propostalaudos`);
                }
            })
        }
    }

    const handleLiberar = (id: number) => {
        if(confirm('Deseja realmente liberar o laudo?')){
            setIsLoading(true);

            formValitationSchemaLiberar
            .validate(formRef.current?.getData(), { abortEarly: false })
            .then((dadosValidados) => {
                PropostaLaudoService.liberarById(id)
                .then(result => {
                    setIsLoading(false);

                    if (result instanceof Error){
                        setAlertMessage(result.message);
                        setAlertSeverity("error");

                    } else {
                        setAlertMessage('Registro liberado com sucesso!');
                        setAlertSeverity("success");

                        setStatus(Number(result.status));
                    }
                })
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
        } 
    }

    const handleVoltar = (id: number) => {
        if(confirm('Deseja realmente voltar o laudo?')){
            setIsLoading(true);

            PropostaLaudoService.voltarById(id)
            .then(result => {
                setIsLoading(false);
                
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    setAlertMessage('Registro voltado com sucesso!');
                    setAlertSeverity("success");

                    setStatus(Number(result.status));
                }
            })
        } 
    };

    const handleFormOnChange = () => {
        setIsChanging(true);
    };

    return(
        <LayoutBaseDePagina 
            titulo={id === 'novo' ? 'Novo laudo de acompanhamento' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Novo"
                    mostrarBotaoSalvar={permissions?.Editar  && status == StatusPropostaLaudo.Cadastrado}
                    mostrarBotaoSalvarEFechar={permissions?.Editar  && status == StatusPropostaLaudo.Cadastrado}
                    mostrarBotaoNovo={id !== 'novo' && permissions?.Editar}
                    mostrarBotaoApagar={id !== 'novo' && permissions?.Excluir && status == StatusPropostaLaudo.Cadastrado}
     
                    aoClicarEmApagar={() => {handleDelete(Number(id))}}
                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmNovo={() => {navigate(`/proposta/${propostaid}/propostalaudo/novo`)}}
                    aoClicarEmVoltar={() => {navigate(`/proposta/${propostaid}/propostalaudos`)}}

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
            <VForm ref={formRef} onSubmit={handleSave} onChange={handleFormOnChange}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
                    <Grid container direction="column" padding={2} spacing={2}>

                        {isLoading &&(
                            <Grid item>
                            <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Status: {status == StatusPropostaLaudo.Cadastrado ? "Cadastrado" : "Encerrado"}</Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Geral</Typography>
                        </Grid>
                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={2} md={1}>
                                <VTextField 
                                    fullWidth 
                                    label="Seq"
                                    placeholder="Seq" 
                                    name="sequencial"
                                    disabled={true} //Proprio backend gera o sequencial
                                />
                            </Grid>
                            <Grid item xs={5} md={2.5}>
                                <VTextField 
                                    fullWidth 
                                    label="Data da vistoria"
                                    placeholder="Data da vistoria" 
                                    name="datavistoria"
                                    type="datetime-local"
                                    disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado} //Proprio backend gera o sequencial
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={5} md={2.5}>
                                <VTextField 
                                    fullWidth 
                                    label="Data do laudo"
                                    placeholder="Data do laudo" 
                                    name="datalaudo"
                                    type="datetime-local"
                                    disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado} //Proprio backend gera o sequencial
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Produtividade do plano"
                                    placeholder="Produtividade do plano" 
                                    name="produtividadeplano"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado} //Proprio backend gera o sequencial
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">kg/ha</InputAdornment>,
                                        inputMode: "decimal",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Produtividade obtida"
                                    placeholder="Produtividade obtida" 
                                    name="produtividadeobtida"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado} //Proprio backend gera o sequencial
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">kg/ha</InputAdornment>,
                                        inputMode: "decimal",
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row">
                            <Grid item xs={12} md={6} lg={4}>
                                <FormControlLabel
                                    label="Área cultivada corresponde a financiada?"
                                    control={
                                        <VCheckBox 
                                            name="ehareacultivadafinanciada"
                                            disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <FormControlLabel
                                    label="Lavoura plantada corresponde a financiada?"
                                    control={
                                        <VCheckBox 
                                            name="ehlavouraplantadafinanciada"
                                            disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <FormControlLabel
                                    label="Croqui identifica a área?"
                                    control={
                                        <VCheckBox 
                                            name="ehcroquiidentificaarea"
                                            disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <FormControlLabel
                                    label="Possui área com recursos próprios?"
                                    control={
                                        <VCheckBox 
                                            name="ehpossuiarearecursoproprio"
                                            disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <FormControlLabel
                                    label="Época de plantio atendeu ao zoneamento agrícola?"
                                    control={
                                        <VCheckBox 
                                            name="ehepocaplantiozoneamento"
                                            disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Conclusão</Typography>
                        </Grid>

                        <Grid container item direction="row">
                            <Grid item xs={12} md={6} lg={4}>
                                <FormControlLabel
                                    label="Crédito aplicado corretamente?"
                                    control={
                                        <VCheckBox 
                                            name="ehcreditoaplicadocorreto"
                                            disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <FormControlLabel
                                    label="Mutuário vem atendendo as recomendações?"
                                    control={
                                        <VCheckBox 
                                            name="ehatendendorecomendacao"
                                            disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row">
                            <Grid item xs={12}>
                                <VTextField 
                                    fullWidth
                                    label="Situação do empreendimento"
                                    placeholder="Situação do empreendimento" 
                                    name="situacaoempreendimento"
                                    disabled={isLoading || !permissions?.Editar  || status == StatusPropostaLaudo.Encerrado}
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
                                    disabled={isLoading || !permissions?.Editar || status == StatusPropostaLaudo.Encerrado}
                                />
                            </Grid>
                        </Grid>

                        <Grid item container spacing={2}>
                            <Grid item>
                            {(status == StatusPropostaLaudo.Cadastrado) && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading || id === 'novo' || !permissions?.Processar || isChanging}
                                    endIcon={<Icon>arrow_forward</Icon>}
                                    onClick={() => {
                                        if (id !== 'novo') {
                                            handleLiberar(Number(id))
                                        }
                                    }}
                                >
                                    Liberar
                                </Button>
                                )}

                                {(status != StatusPropostaLaudo.Cadastrado) && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isLoading || id === 'novo' || !permissions?.Processar || isChanging}
                                        endIcon={<Icon>arrow_back</Icon>}
                                        onClick={() => {
                                            if (id !== 'novo') {
                                                handleVoltar(Number(id))
                                            }
                                        }}
                                    >
                                        Voltar
                                    </Button>
                                )}
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading || id === 'novo' || !permissions?.Visualizar}
                                    endIcon={<Icon>file_present</Icon>}
                                    onClick={() => {
                                        if (id !== 'nova') {
                                            navigate(`/proposta/${propostaid}/propostalaudo/${id}/propostalaudodiagnosticos`);
                                        }
                                    }}
                                >
                                    Diagnósticos
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid> 
                </Box>
            </VForm>
        </LayoutBaseDePagina>
    );
};