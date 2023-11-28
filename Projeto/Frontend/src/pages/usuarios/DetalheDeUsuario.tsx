import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, InputAdornment, Typography, AlertColor, Button } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { UsuarioService } from "../../shared/services/api/usuarios/UsuarioService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import useUserPermissions from "../../shared/hooks/UseUserPermissions";

interface IFormData {
    email: string,
    password: string,
    confirmPassword: string
}

const formValitationSchema: yup.Schema<IFormData> = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
});

export const DetalheDeUsuario: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'novo'} = useParams<'id'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Usuario');

    useEffect(() => {
        if (id !== 'novo'){    

            setIsLoading(true);

            UsuarioService.getById(id)
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){ 
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                    navigate('/usuarios');

                } else {
                    setNome(result.email);

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                email: '',
                password: undefined,
                confirmpassword: ''
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'novo'){
                    UsuarioService.create(dadosValidados)
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            setAlertMessage(result.message);
                            setAlertSeverity("error");
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/usuarios');
        
                            } else {
                                setAlertMessage('Registro criado com sucesso!');
                                setAlertSeverity("success");
                                navigate(`/usuario/${result.id}`);
                            }
                        }  
                    })
                };
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

    const handleDelete = (id: string) => {
        if(confirm('Deseja realmente excluir o usuario?')){
            UsuarioService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");

                } else {
                    alert('Registro apagado com sucesso!');

                    navigate('/usuarios');
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'novo' ? 'Novo usuario' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Novo"
                    mostrarBotaoSalvarEFechar={id === 'novo' && permissions?.Editar}
                    mostrarBotaoSalvar={id === 'novo' && permissions?.Editar}
                    mostrarBotaoNovo={id !== 'novo' && permissions?.Editar}
                    mostrarBotaoApagar={id !== 'novo' && permissions?.Excluir}
     
                    aoClicarEmApagar={() => {handleDelete(id)}}
                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmNovo={() => {navigate('/usuario/novo')}}
                    aoClicarEmVoltar={() => {navigate('/usuarios')}}

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
                                    label="Email"
                                    placeholder="Email" 
                                    name="email"
                                    disabled={isLoading || id != 'novo' || !permissions?.Editar}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <VTextField 
                                    fullWidth 
                                    label="Senha"
                                    placeholder="Senha" 
                                    name="password"
                                    type="password"
                                    disabled={isLoading || id != 'novo' || !permissions?.Editar}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <VTextField 
                                    fullWidth 
                                    label="Confirmar senha"
                                    placeholder="Confirmar senha" 
                                    type="password"
                                    name="confirmPassword"
                                    disabled={isLoading || id != 'novo' || !permissions?.Editar}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={2} >
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isLoading || id === 'novo' || !permissions?.Visualizar}
                                onClick={() => {
                                    if (id !== 'novo') {
                                        navigate(`/usuario/${id}/permissoes`);
                                    }
                                }}
                            >
                                Permissões
                            </Button>
                        </Grid>
                    </Grid> 
                    
                </Box>
            </VForm>
        </LayoutBaseDePagina>
    );
};