import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, Typography, AlertColor } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { AutoCompleteFilial, FerramentasDeDetalhe, AutoCompleteTipoProposta, AutoCompleteCultura } from "../../shared/components";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
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
    valortotalrecursoproprio: yup.number().min(0.01),
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
                
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate('/propostas');

                } else {
                    console.log(result);
                    setNome('Proposta Nr.' + result.id);

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                nome: '',
                observacao: '',
                tipoDocumentacaoObrigatoria: undefined
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

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
                                    label="Filial"
                                    placeholder="Filial" 
                                    name="data"
                                    type="date"
                                    disabled={isLoading || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <AutoCompleteFilial  
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
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