import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography, AlertColor } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe, FileInput } from "../../shared/components";
import { DocumentacaoService } from "../../shared/services/api/documentacoes/DocumentacaoService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import useUserPermissions from "../../shared/hooks/UseUserPermissions";
import { AutoCompleteTipoDocumentacao } from "../../shared/components/auto-complete/AutoCompleteTipoDocumentacao";
import { detectFileTypeFromBase64 } from "../../shared/helpers/FileTypeFromBase64";

interface IFormData {
    nome: string;
    tipo: number;
    arquivo: File;
}

const formValitationSchema: yup.Schema<Omit<IFormData, 'arquivo'>> = yup.object({
    nome: yup.string().required(),
    tipo: yup.number().required(),
});

export const DetalheDeDocumentacao: React.FC = () => {
    const navigate = useNavigate();

    const {id = 'nova'} = useParams<'id'>();
    
    const {pessoaid = ''} = useParams<'pessoaid'>();
    const {propostaid = ''} = useParams<'propostaid'>();
    const {imovelid = ''} = useParams<'imovelid'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Cultura');

    const [extensao, setExtensao] = useState('');

    useEffect(() => {
        if (id !== 'nova'){    

            setIsLoading(true);

            DocumentacaoService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigateBack();

                } else {
                    setNome(result.nome);

                    // Não sei pq esse diabo não funciona com a extensao do state, então tive que criar uma constante separada
                    const ext = detectFileTypeFromBase64(String(result.arquivo), ''); 
                    setExtensao(detectFileTypeFromBase64(String(result.arquivo), ''));

                    // Decodifique a representação Base64
                    const decodedData = atob(String(result.arquivo));

                    // Converta a representação decodificada em um ArrayBuffer
                    const arrayBuffer = new ArrayBuffer(decodedData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    for (let i = 0; i < decodedData.length; i++) {
                        uint8Array[i] = decodedData.charCodeAt(i);
                    }

                    // Crie um Blob a partir do ArrayBuffer
                    const blob = new Blob([arrayBuffer]);

                    result.arquivo = new File([blob], `${result.nome}.${ext}`, { lastModified: Date.now() });

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                nome: '',
                tipo: undefined,
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'nova'){
                    console.log(dadosValidados.tipo);
                    DocumentacaoService.create(dados.arquivo, { proposta: Number(propostaid), imovel: Number(imovelid), pessoa: Number(pessoaid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigateBack()
        
                            } else {
                                setAlertMessage('Registro criado com sucesso!');
                                setAlertSeverity("success");
                                navigateBack(String(result.id));
                            }
                        }  
                    })
                } else {
                    DocumentacaoService.updateById(Number(id), dados.arquivo, { proposta: Number(propostaid), imovel: Number(imovelid), pessoa: Number(pessoaid), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigateBack()
        
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
            DocumentacaoService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    alert('Registro apagado com sucesso!');

                    navigateBack();
                }
            })
        }
    }

    const navigateBack = (codigo = '') => {
        let urlFinal = '';

        if (codigo != ''){
            urlFinal = `documentacao/${codigo}`;
        } else {
            urlFinal = `documentacoes`; 
        }


        if(pessoaid != ''){
            navigate(`/pessoa/${pessoaid}/${urlFinal}`);

        } else if(propostaid != ''){
            navigate(`/proposta/${propostaid}/${urlFinal}`);
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'nova' ? 'Nova documentação' : nome}
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
                    aoClicarEmNovo={() => {navigateBack('nova')}}
                    aoClicarEmVoltar={() => {navigateBack()}}

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
                            <Grid item xs={12} md={4}>
                                <VTextField 
                                    fullWidth 
                                    label="Nome"
                                    placeholder="Nome" 
                                    name="nome"
                                    disabled={isLoading || !permissions?.Editar}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <AutoCompleteTipoDocumentacao
                                    isExternalLoading={isLoading}
                                    disabled={!permissions?.Editar}
                                    nomeField="tipo"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FileInput
                                    label={"Arquivo"}
                                    name="arquivo"
                                    extensao={extensao}
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