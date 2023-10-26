import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography, AlertColor } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import useUserPermissions from "../../shared/hooks/UseUserPermissions";
import { TipoPropostaService } from "../../shared/services/api/propostas/TipoPropostaService";
import { MultiSelectChip, MultiSelectChipOptions } from "../../shared/components/multi-select/MultiSelectChip";
import { TipoDocumentacaoService } from "../../shared/services/api/documentacoes/TipoDocumentacaoService";

interface IFormData {
    nome: string;
    observacao: string;
    tipoDocumentacaoObrigatoria: number[];
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nome: yup.string().required(),
    observacao: yup.string().default(''),
    tipoDocumentacaoObrigatoria: yup.array().of(
        yup.number().required("Cada elemento em 'tipoDocumentacaoObrigatoria' deve ser um número.")
    ).default([]),
});

export const DetalheDeTipoProposta: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'novo'} = useParams<'id'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Proposta');

    const [opcoesTipoDocumentacao, setOpcoesTipoDocumentacao] = useState<MultiSelectChipOptions[]>([]);

    useEffect(() => {
        TipoDocumentacaoService.getAllAll()
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error){
                    //alert(result.message);
                } else {
                    console.log(result);

                    setOpcoesTipoDocumentacao(result.map(tipo => ({value: tipo.id, label: tipo.nome})));
                }
            });

        if (id !== 'novo'){    

            setIsLoading(true);

            TipoPropostaService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate('/tiposproposta');

                } else {
                    console.log(result);
                    setNome(result.nome);

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
                if(id === 'novo'){
                    TipoPropostaService.create(dadosValidados)
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/tiposproposta');
        
                            } else {
                                setAlertMessage('Registro criado com sucesso!');
                                setAlertSeverity("success");
                                navigate(`/tipoproposta/${result.id}`);
                            }
                        }  
                    })
                } else {
                    TipoPropostaService.updateById(Number(id), {id: Number(id), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/tiposproposta');
        
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
        if(confirm('Deseja realmente excluir o tipo de proposta?')){
            TipoPropostaService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    alert('Registro apagado com sucesso!');

                    navigate('/tiposproposta');
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'novo' ? 'Novo tipo de proposta' : nome}
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
                    aoClicarEmNovo={() => {navigate('/tipoproposta/novo')}}
                    aoClicarEmVoltar={() => {navigate('/tiposproposta')}}

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
                            <Grid item xs={12} md={6}>
                                <VTextField 
                                    fullWidth 
                                    label="Nome"
                                    placeholder="Nome" 
                                    name="nome"
                                    disabled={isLoading || !permissions?.Editar}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MultiSelectChip 
                                    label="Tipos de documentação obrigatórias"
                                    name="tipoDocumentacaoObrigatoria"
                                    disabled={isLoading || !permissions?.Editar}
                                    options={opcoesTipoDocumentacao}
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