import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, Typography, AlertColor, InputAdornment, FormControlLabel, Button, Icon } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { AutoCompleteFilial, FerramentasDeDetalhe, AutoCompleteTipoProposta, AutoCompleteCultura, AutoCompletePessoa } from "../../shared/components";
import { VTextField, VForm, useVForm, IVFormErrors, VCheckBox } from "../../shared/forms";
import useUserPermissions from "../../shared/hooks/UseUserPermissions";
import { PropostaService } from "../../shared/services/api/propostas/PropostaService";

interface IFormData {
    areafinanciada?: number,
    avalista?: number,
    carenciameses?: number,
    cultura: number
    data: Date,
    datacolheita?: Date,
    dataplantio?: Date,
    ehastecfinanciada?: boolean,
    ehpossuilaudoacompanhamento?: boolean,
    filial: number,
    linhacredito?: string,
    numeroparcela?: number,
    origemrecursoproprio?: string,
    prazomeses?: number,
    produtividadeesperada?: number,
    produtividademedia?: number,
    proponente: number,
    responsaveltecnico?: number,
    status?: number,
    taxajuros?: number,
    tipo: number,
    valorastec?: number,
    valortotalfinanciado?: number,
    valortotalfinanciamento?: number,
    valortotalorcamento?: number,
    valortotalrecursoproprio?: number,
    valorunitariofinanciamento?: number,
    vencimento?: Date,
    observacao?: string
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    areafinanciada: yup.number().min(0.01),
    avalista: yup.number().required().default(undefined),
    carenciameses: yup.number().required().default(0),
    cultura: yup.number().required().default(undefined),
    data: yup.date().required(),
    datacolheita: yup.date().required(),
    dataplantio: yup.date().required(),
    ehastecfinanciada: yup.boolean().required(),
    ehpossuilaudoacompanhamento: yup.boolean().required(),
    filial: yup.number().required().default(undefined),
    linhacredito: yup.string().required(),
    numeroparcela: yup.number().required().default(0),
    origemrecursoproprio: yup.string().required(),
    prazomeses: yup.number().required().default(0),
    produtividadeesperada: yup.number().min(0.01),
    produtividademedia: yup.number().min(0.01),
    proponente: yup.number().required().default(undefined),
    responsaveltecnico: yup.number().required().default(undefined),
    status: yup.number(),
    taxajuros: yup.number().required(),
    tipo: yup.number().required().default(undefined),
    valorastec: yup.number().min(0.01),
    valortotalfinanciado: yup.number().min(0.01),
    valortotalfinanciamento: yup.number().min(0.01),
    valortotalorcamento: yup.number().min(0.01),
    valortotalrecursoproprio: yup.number(),
    valorunitariofinanciamento: yup.number().min(0.01),
    vencimento: yup.date().required(),
    observacao: yup.string().required(),
});

export const DetalheDeProposta: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'nova'} = useParams<'id'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Proposta');

    useEffect(() => {

        if (id !== 'nova'){    

            setIsLoading(true);

            PropostaService.getById(Number(id))
            .then((result)=> {
                console.log(result);
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate('/propostas');

                } else {
                    setNome('Proposta Nr.' + id);

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                data: Date.now,
                ehastecfinanciada: false,
                ehpossuilaudoacompanhamento: false,
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {
        console.log(dados);
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'nova'){
                    PropostaService.create(dadosValidados)
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/propostas');
        
                            } else {
                                setAlertMessage('Registro criado com sucesso!');
                                setAlertSeverity("success");
                                navigate(`/proposta/${result.id}`);
                            }
                        }  
                    })
                } else {
                    PropostaService.updateById(Number(id), {id: Number(id), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/propostas');
        
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
        if(confirm('Deseja realmente excluir a proposta?')){
            PropostaService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    alert('Registro apagado com sucesso!');

                    navigate('/propostas');
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'nova' ? 'Nova proposta' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvar={permissions?.Editar}
                    mostrarBotaoSalvarEFechar={permissions?.Editar}
                    mostrarBotaoNovo={id !== 'nova' && permissions?.Editar}
                    mostrarBotaoApagar={id !== 'nova' && permissions?.Excluir}
     
                    aoClicarEmApagar={() => {handleDelete(Number(id))}}
                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmNovo={() => {navigate('/proposta/nova')}}
                    aoClicarEmVoltar={() => {navigate('/propostas')}}

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
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth 
                                    label="Data"
                                    placeholder="Data" 
                                    name="data"
                                    type="datetime-local"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <AutoCompleteFilial  
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <AutoCompleteTipoProposta  
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <AutoCompleteCultura  
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth 
                                    label="Linha de crédito"
                                    placeholder="Linha de crédito" 
                                    name="linhacredito"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <AutoCompletePessoa 
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                    nomeField="proponente"
                                    label="Proponente"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <AutoCompletePessoa 
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                    nomeField="avalista"
                                    label="Avalista"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <AutoCompletePessoa 
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                    nomeField="responsaveltecnico"
                                    label="Responsável técnico"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    label="Possui laudo de acompanhamento"
                                    control={
                                        <VCheckBox 
                                            placeholder="Possui laudo de acompanhamento" 
                                            name="ehpossuilaudoacompanhamento"
                                            disabled={isLoading || !permissions?.Editar}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Produção</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Data de plantio"
                                    placeholder="Data de plantio" 
                                    name="dataplantio"
                                    type="datetime-local"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Data de colheita"
                                    placeholder="Data de colheita" 
                                    name="datacolheita"
                                    type="datetime-local"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Produtividade média"
                                    placeholder="Produtividade média" 
                                    name="produtividademedia" 
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">kg/há</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Produtividade esperada"
                                    placeholder="Produtividade esperada" 
                                    name="produtividadeesperada" 
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">kg/há</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Orçamento</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="Área financiada"
                                    placeholder="Área financiada" 
                                    name="areafinanciada" 
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">há</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    type="number"
                                    label="Valor unitário"
                                    placeholder="Valor unitário" 
                                    name="valorunitariofinanciamento"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    type="number"
                                    label="Valor total do orçamento"
                                    placeholder="Valor total do orçamento" 
                                    name="valortotalorcamento"
                                    disabled={true} //Pois deve calcular o valor unitario vs area ha
                                    //disabled={isLoading || !permissions?.Editar}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    type="number"
                                    label="Valor do recurso próprio"
                                    placeholder="Valor dos recursos próprios" 
                                    name="valortotalrecursoproprio"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                />
                            </Grid>
                            <Grid item xs={8} md={3}>
                                <VTextField 
                                    fullWidth
                                    label="Origem do recurso próprio"
                                    placeholder="Origem do recurso próprio" 
                                    name="origemrecursoproprio"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    type="number"
                                    label="Valor total do financiamento"
                                    placeholder="Valor total do financiamento" 
                                    name="valortotalfinanciamento"
                                    disabled={true} //Valor orçamento menos recursos proprios
                                    //disabled={isLoading || !permissions?.Editar}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    type="number"
                                    label="Valor de ASTEC"
                                    placeholder="Valor de ASTEC" 
                                    name="valorastec"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    type="number"
                                    label="Valor total financiado"
                                    placeholder="Valor total financiado" 
                                    name="valortotalfinanciado"
                                    disabled={true}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    label="ASTEC Financiada"
                                    control={
                                        <VCheckBox 
                                            placeholder="ASTEC Financiada" 
                                            name="ehastecfinanciada"
                                            disabled={isLoading || !permissions?.Editar}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Financiamento</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    label="Prazo (meses)"
                                    placeholder="Prazo (meses)" 
                                    name="prazomeses"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <VTextField 
                                    fullWidth
                                    label="Número de parcelas"
                                    placeholder="Número de parcelas" 
                                    name="numeroparcela"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={4} md={2}>
                                <VTextField 
                                    fullWidth
                                    label="Carência (meses)"
                                    placeholder="Carência (meses)" 
                                    name="carenciameses"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth
                                    label="Taxa de juros"
                                    placeholder="Taxa de juros" 
                                    name="taxajuros"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth
                                    label="Vencimento"
                                    placeholder="Vencimento" 
                                    name="vencimento"
                                    type="datetime-local"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
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

                        <Grid container item spacing={2}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading || id === 'nova' || !permissions?.Processar}
                                    endIcon={<Icon>arrow_forward</Icon>}
                                    onClick={() => {
                                        if (id !== 'nova') {
                                           // handleLiberar
                                        }
                                    }}
                                >
                                    Liberar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading || id === 'nova' || !permissions?.Visualizar}
                                    endIcon={<Icon>file_present</Icon>}
                                    onClick={() => {
                                        if (id !== 'nova') {
                                            navigate(`/proposta/${id}/documentacoes`);
                                        }
                                    }}
                                >
                                    Documentações
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading || id === 'nova' || !permissions?.Visualizar}
                                    endIcon={<Icon>location_on</Icon>}
                                    onClick={() => {
                                        if (id !== 'nova') {
                                            navigate(`/proposta/${id}/propostaimoveis`);
                                        }
                                    }}
                                >
                                    Imóveis da proposta
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading || id === 'nova' || !permissions?.Visualizar}
                                    endIcon={<Icon>task</Icon>}
                                    onClick={() => {
                                        if (id !== 'nova') {
                                            navigate(`/proposta/${id}/propostalaudos`);
                                        }
                                    }}
                                >
                                    Laudos de acompanhamento
                                </Button>
                            </Grid>
                        </Grid> 
                    </Grid> 
                </Box>
            </VForm>
        </LayoutBaseDePagina>
    );
};