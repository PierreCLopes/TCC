import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, Typography, FormControlLabel } from "@mui/material";
import * as yup from 'yup';

import { LayoutBaseDePagina } from "../../shared/layouts";
import { AutoCompleteCidade, FerramentasDeDetalhe } from "../../shared/components";
import { PessoaService } from "../../shared/services/api/pessoas/PessoaService";
import { VTextField, VForm, useVForm, IVFormErrors, VSelectField } from "../../shared/forms";
import { VCheckBox } from "../../shared/forms/VCheckBox";

interface IFormData {
    nome: string,
    apelido: string,
    cnpjcpf: string,
    telefone: string,
    observacao: string,
    rg: string,
    email: string,
    ehtecnico: boolean,
    cfta: string,
    tipo: number
}

const formValitationSchema: yup.Schema<IFormData> = yup.object({
    nome: yup.string().required(),
    apelido: yup.string().max(30).default(''),
    cnpjcpf: yup.string().test('valid-cnpj-cpf', 'CNPJ ou CPF inválido', function (value) {
        const { tipo } = this.parent; // Obtém o valor de 'tipo' do objeto
    
        console.log(tipo);
        
        if (typeof value === 'string') { // Verifica se 'cnpjcpf' é uma string válida
            if (tipo === 1) { // Se o tipo for 1 (Física), valida como CPF (deve ter 14 caracteres)
                return value.length === 14;
            } else { // Senão, valida como CNPJ (deve ter 18 caracteres)
                return value.length === 18;
            }
        }
    
        return false; // Se 'cnpjcpf' não for uma string válida, retorna false
    }).required(),
    telefone: yup.string().default(''),
    observacao: yup.string().default(''),
    rg: yup.string().default(''),
    email: yup.string().email().default(''),
    ehtecnico: yup.boolean().default(false),
    cfta: yup.string().required().default(''),
    tipo: yup.number().required(),
});

export const DetalheDePessoa: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'nova'} = useParams<'id'>();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (id !== 'nova'){    

            setIsLoading(true);

            PessoaService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){
                    alert(result.message);
                    navigate('/pessoas');

                } else {
                    console.log(result);

                    setNome(result.nome);

                    formRef.current?.setData(result);
                }
            })
        } else {
            formRef.current?.setData({
                nome: '',
                apelido: '',
                cnpjcpf: '',
                telefone: '',
                observacao: '',
                rg: '',
                email: '',
                ehtecnico: false,
                cfta: '',
                tipo: undefined
            });
        }
    }, [id])

    const handleSave = (dados: IFormData) => {
        console.log(dados);
        formValitationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                if(id === 'nova'){
                    PessoaService.create(dadosValidados)
                    .then((result) => {
        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            alert(result.message);
        
                        } else {
        
                            if(isSaveAndClose()){
                                navigate('/pessoas');
        
                            } else {
                                alert('Registro criado com sucesso!');
                                navigate(`/pessoa/${result.id}`);
                            }
                        }  
                    })
                } else {
                    console.log(dadosValidados);
                    PessoaService.updateById(Number(id), dadosValidados)
                    .then((result) => {
                        
                        setIsLoading(false);
        
                        if (result instanceof Error){
                            alert(result.message);
        
                        } else {
                            if(isSaveAndClose()){
                                navigate('/pessoas');
        
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
        if(confirm('Deseja realmente excluir a pessoa?')){
            PessoaService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    alert('Registro apagado com sucesso!');
                    navigate('/pessoas');
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'nova' ? 'Nova pessoa' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={id !== 'nova'}
                    mostrarBotaoApagar={id !== 'nova'}
     
                    aoClicarEmApagar={() => {handleDelete(Number(id))}}
                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmNovo={() => {navigate('/pessoa/nova')}}
                    aoClicarEmVoltar={() => {navigate('/pessoas')}}

                    mostrarBotaoSalvarCarregando={isLoading}
                    mostrarBotaoApagarCarregando={isLoading}
                    mostrarBotaoNovoCarregando={isLoading}
                    mostrarBotaoSalvarEFecharCarregando={isLoading}
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave} >
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
                            <Grid item xs={12} md={4}>
                                <VTextField 
                                    fullWidth 
                                    label="Apelido"
                                    placeholder="Apelido" 
                                    name="apelido"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <VSelectField
                                    fullWidth 
                                    label="Tipo"
                                    placeholder="Tipo" 
                                    name="tipo"
                                    disabled={isLoading}
                                    options={[
                                        { value: 1, label: 'Física' },
                                        { value: 2, label: 'Jurídica' }
                                      ]}
                                />
                            </Grid> 
                            <Grid item xs={6} md={2}>
                                <VTextField 
                                    fullWidth 
                                    label="CNPJ/CPF"
                                    placeholder="CNPJ/CPF" 
                                    name="cnpjcpf"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth 
                                    label="CFTA"
                                    placeholder="CFTA" 
                                    name="cfta"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth
                                    label="Telefone"
                                    placeholder="Telefone" 
                                    name="telefone"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth
                                    label="RG"
                                    placeholder="RG" 
                                    name="rg"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <VTextField 
                                    fullWidth
                                    label="Email"
                                    placeholder="Email" 
                                    name="email"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
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

                        <Grid container item direction="row">
                            <Grid item xs={12}>
                                <FormControlLabel
                                    label="Técnico"
                                    control={
                                        <VCheckBox 
                                            placeholder="É Técnico" 
                                            name="ehtecnico"
                                            disabled={isLoading}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Endereço</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={4}>
                                <AutoCompleteCidade 
                                    isExternalLoading={isLoading}
                                    nomeField="endereco.cidade"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <VTextField 
                                    fullWidth
                                    label="CEP"
                                    placeholder="CEP" 
                                    name="endereco.cep"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <VTextField 
                                    fullWidth
                                    label="Bairro"
                                    placeholder="Bairro" 
                                    name="endereco.bairro"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <VTextField 
                                    fullWidth
                                    label="Número"
                                    placeholder="Número" 
                                    name="endereco.numero"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row">
                            <Grid item xs={12}>
                                <VTextField 
                                    fullWidth
                                    label="Complemento"
                                    placeholder="Complemento" 
                                    name="endereco.complemento"
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
                                    name="endereco.observacao"
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