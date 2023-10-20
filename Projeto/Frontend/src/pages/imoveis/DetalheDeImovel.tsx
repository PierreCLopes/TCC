import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { AutoCompleteCidade, FerramentasDeDetalhe } from "../../shared/components";
import { ImovelService } from "../../shared/services/api/imoveis/ImovelService";
import { VTextField, VForm, useVForm, IVFormErrors, formatCNPJCPF } from "../../shared/forms";
import { FileInput } from "../../shared/components/file-input/FileInput";
import { detectFileTypeFromBase64 } from "../../shared/helpers/FileTypeFromBase64";

interface IFormData {
    observacao: string,
    nome: string,
    proprietario: number,
    matricula: string,
    areatotal: number,
    latitude: string,
    longitude: string,
    areaagricola: number,
    areapastagem: number,
    cidade: number,
    roteiroacesso: string,
    arquivokml: File
}

const formValitationSchema: yup.Schema<Omit<IFormData, 'arquivokml'>> = yup.object({
    nome: yup.string().required(),
    proprietario: yup.number().default(0),
    observacao: yup.string().default(''),
    matricula: yup.string().required(),
    latitude: yup.string().required(),
    longitude: yup.string().required(),
    areatotal: yup.number().required().min(0.01),
    areaagricola: yup.number().default(0),
    areapastagem: yup.number().default(0),
    cidade: yup.number().required().moreThan(0),
    roteiroacesso: yup.string().required()
});

export const DetalheDeImovel: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'novo'} = useParams<'id'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [extensao, setExtensao] = useState('');

    useEffect(() => {
        if (id !== 'novo'){    

            setIsLoading(true);

            ImovelService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){
                    alert(result.message);
                    navigate('/imoveis');

                } else {
                    setNome(result.nome);
                    
                    // Não sei pq esse diabo não funciona com a extensao do state, então tive que criar uma constante separada
                    const ext = detectFileTypeFromBase64(String(result.arquivokml)); 
                    setExtensao(detectFileTypeFromBase64(String(result.arquivokml)));

                    // Decodifique a representação Base64
                    const decodedData = atob(String(result.arquivokml));

                    // Converta a representação decodificada em um ArrayBuffer
                    const arrayBuffer = new ArrayBuffer(decodedData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    for (let i = 0; i < decodedData.length; i++) {
                        uint8Array[i] = decodedData.charCodeAt(i);
                    }

                    // Crie um Blob a partir do ArrayBuffer
                    const blob = new Blob([arrayBuffer]);

                    result.arquivokml = new File([blob], `arquivo.${ext}`, { lastModified: Date.now() });

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                observacao: '',
                nome: '',
                proprietario: 0,
                matricula: '',
                areatotal: 0,
                latitude: '',
                longitude: '',
                areaagricola: 0,
                areapastagem: 0,
                cidade: undefined,
                roteiroacesso: '',
                arquivokml: undefined
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {
        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'novo'){
                    ImovelService.create(dadosValidados)
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            alert(result.message);
        
                        } else {
                            // Envie o arquivo do imóvel
                            ImovelService.uploadFile(result.id, dados.arquivokml)
                            .then((resultFile) => {
                                if (resultFile instanceof Error) 
                                    alert(resultFile.message);
                            });
        
                            if(isSaveAndClose()){
                                navigate('/imoveis');
        
                            } else {
                                alert('Registro criado com sucesso!');
                                navigate(`/imovel/${result.id}`);
                            }
                        }  
                    })
                } else {
                    console.log(dadosValidados);
                    ImovelService.updateById(Number(id), dadosValidados)
                    .then((result) => {
                        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            alert(result.message);
        
                        } else {
                            // Envie o arquivo do imóvel
                            ImovelService.uploadFile(Number(id), dados.arquivokml)
                            .then((resultFile) => {
                                if (resultFile instanceof Error) 
                                    alert(resultFile.message);
                            });

                            if(isSaveAndClose()){
                                navigate('/imoveis');
        
                            } else {
                                alert('Registro alterado com sucesso!');
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
        if(confirm('Deseja realmente excluir o imóvel?')){
            ImovelService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    alert('Registro apagado com sucesso!');
                    navigate('/imoveis');
                }
            })
        }
    }

    const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const formattedCpf = formatCNPJCPF(input);
        formRef.current?.setFieldValue('cpf', formattedCpf);
      };

    return(
        <LayoutBaseDePagina 
            titulo={id === 'novo' ? 'Novo imóvel' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Novo"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={id !== 'novo'}
                    mostrarBotaoApagar={id !== 'novo'}
     
                    aoClicarEmApagar={() => {handleDelete(Number(id))}}
                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmNovo={() => {navigate('/imovel/novo')}}
                    aoClicarEmVoltar={() => {navigate('/imoveis')}}

                    mostrarBotaoSalvarCarregando={isLoading}
                    mostrarBotaoApagarCarregando={isLoading}
                    mostrarBotaoNovoCarregando={isLoading}
                    mostrarBotaoSalvarEFecharCarregando={isLoading}
                />
            }
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
                                    disabled={isLoading}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth 
                                    label="Área total"
                                    placeholder="Área total" 
                                    name="areatotal" 
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ha</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth 
                                    label="Área agrícola"
                                    placeholder="Área agrícola" 
                                    name="areaagricola" 
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ha</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth 
                                    label="Área de pastagem"
                                    placeholder="Área de pastagem" 
                                    name="areapastagem" 
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ha</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <FileInput
                                    name="arquivokml"
                                    extensao={extensao}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} md={4}>
                                <VTextField 
                                    fullWidth
                                    label="Proprietário"
                                    placeholder="Proprietário" 
                                    name="proprietario"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <AutoCompleteCidade 
                                    isExternalLoading={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth
                                    label="Matrícula"
                                    placeholder="Matrícula" 
                                    name="matricula"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth
                                    label="Latitude"
                                    placeholder="Latitude" 
                                    name="latitude"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth
                                    label="Longitude"
                                    placeholder="Longitude" 
                                    name="longitude"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row">
                            <Grid item xs={12}>
                                <VTextField 
                                    fullWidth
                                    label="Roteiro de acesso"
                                    placeholder="Roteiro de acesso" 
                                    name="roteiroacesso"
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>
                    </Grid> 
                </Box>
            </VForm>
        </LayoutBaseDePagina>
    );
};