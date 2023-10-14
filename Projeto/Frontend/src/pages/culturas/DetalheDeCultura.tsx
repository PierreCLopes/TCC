import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { CulturaService } from "../../shared/services/api/culturas/CulturaService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";

interface IFormData {
    nome: string;
    precokg: number;
    observacao: string;
}

const formValitationSchema: yup.Schema<IFormData> = yup.object({
    nome: yup.string().required(),
    precokg: yup.number().required().min(0.01),
    observacao: yup.string().default(''),
});

export const DetalheDeCultura: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'nova'} = useParams<'id'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (id !== 'nova'){    

            setIsLoading(true);

            CulturaService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){
                    alert(result.message);
                    navigate('/culturas');

                } else {
                    console.log(result);
                    setNome(result.nome);

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                nome: '',
                precokg: 0,
                observacao: ''
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'nova'){
                    CulturaService.create(dadosValidados)
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            alert(result.message);
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/culturas');
        
                            } else {
                                alert('Registro criado com sucesso!');
                                navigate(`/cultura/${result.id}`);
                            }
                        }  
                    })
                } else {
                    CulturaService.updateById(Number(id), {id: Number(id), ...dadosValidados})
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            alert(result.message);
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/culturas');
        
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
        if(confirm('Deseja realmente excluir a cultura?')){
            CulturaService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    alert('Registro apagado com sucesso!');
                    navigate('/culturas');
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'nova' ? 'Nova cultura' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={id !== 'nova'}
                    mostrarBotaoApagar={id !== 'nova'}
     
                    aoClicarEmApagar={() => {handleDelete(Number(id))}}
                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmNovo={() => {navigate('/cultura/nova')}}
                    aoClicarEmVoltar={() => {navigate('/culturas')}}

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
                            <Grid item xs={6}>
                                <VTextField 
                                    fullWidth 
                                    label="Nome"
                                    placeholder="Nome" 
                                    name="nome"
                                    disabled={isLoading}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <VTextField 
                                    fullWidth 
                                    label="Preço por Kg"
                                    placeholder="Preço por Kg" 
                                    name="precokg" 
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputMode: "decimal",
                                        
                                    }}
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