import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography, AlertColor } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { AutoCompleteImovel, FerramentasDeDetalhe } from "../../shared/components";
import { PropostaImovelService } from "../../shared/services/api/propostas/PropostaImovelService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import useUserPermissions from "../../shared/hooks/UseUserPermissions";

interface IFormData {
    area: number;
    imovel: number;
}

const formValitationSchema: yup.Schema<IFormData> = yup.object({
    area: yup.number().required().min(0.01),
    imovel: yup.number().required()
});

export const DetalheDePropostaImovel: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'novo'} = useParams<'id'>();
    const {propostaid} = useParams<'propostaid'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Cultura');

    useEffect(() => {
        if (id !== 'novo'){    

            setIsLoading(true);

            PropostaImovelService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate(`/proposta/${propostaid}/propostaimoveis`);

                } else {
                    setNome('Imóvel da proposta Nr.' + id);

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                area: undefined,
                imovel: undefined
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'novo'){
                    PropostaImovelService.create({proposta: Number(propostaid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate(`/proposta/${propostaid}/propostaimoveis`);
        
                            } else {
                                setAlertMessage('Registro criado com sucesso!');
                                setAlertSeverity("success");
                                navigate(`/proposta/${propostaid}/propostaimovel/${result.id}`);
                            }
                        }  
                    })
                } else {
                    PropostaImovelService.updateById(Number(id), {id: Number(id), proposta: Number(propostaid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate(`/proposta/${propostaid}/propostaimoveis`);
        
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
        if(confirm('Deseja realmente excluir a cultura?')){
            PropostaImovelService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    alert('Registro apagado com sucesso!');

                    navigate(`/proposta/${propostaid}/propostaimoveis`);
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'novo' ? 'Novo imóvel da proposta' : nome}
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
                    aoClicarEmNovo={() => {navigate(`/proposta/${propostaid}/propostaimovel/novo`)}}
                    aoClicarEmVoltar={() => {navigate(`/proposta/${propostaid}/propostaimoveis`)}}

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
                            <Grid item xs={6}>
                                <VTextField 
                                    fullWidth 
                                    label="Área"
                                    placeholder="Área" 
                                    name="area"
                                    type="number"
                                    disabled={isLoading || !permissions?.Editar}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">há</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <AutoCompleteImovel
                                    disabled={!permissions?.Editar}
                                    isExternalLoading={isLoading}
                                />
                            </Grid>
                        </Grid>
                    </Grid> 
                </Box>
            </VForm>
        </LayoutBaseDePagina>
    );
};