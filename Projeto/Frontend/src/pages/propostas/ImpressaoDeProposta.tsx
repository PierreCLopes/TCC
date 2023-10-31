import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Box, Paper, Grid, Typography, AlertColor, InputAdornment, FormControlLabel, Button, Icon } from "@mui/material";

import { AutoCompleteFilial, AutoCompleteCultura, AutoCompletePessoa, AutoCompleteTipoProposta } from "../../shared/components";
import { VTextField, VForm, useVForm, VCheckBox } from "../../shared/forms";
import { PropostaService } from "../../shared/services/api/propostas/PropostaService";

export const ImpressaoDeProposta: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<'id'>();

    const { formRef} = useVForm();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        PropostaService.getById(Number(id))
        .then(async (result)=> {
            console.log(result);
            setIsLoading(false);

            if (result instanceof Error) {
                alert(result.message);
                navigate('/propostas');
            } else {
                formRef.current?.setData(result);
            }
        })
    }, [id]); 

    return(
        <VForm ref={formRef} onSubmit={() => {}}>
            <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
                <Grid container direction="column" padding={2} spacing={2}>

                    {isLoading &&(
                        <Grid item>
                        <LinearProgress variant="indeterminate"/>
                        </Grid>
                    )}

                    <Grid item>
                        <Typography variant="h5">Proposta número {id}</Typography>
                    </Grid>

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
                                InputLabelProps={{
                                    shrink: true
                                }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <AutoCompleteFilial  
                                isExternalLoading={isLoading}
                                readonly
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AutoCompleteTipoProposta  
                                isExternalLoading={isLoading}
                                readonly
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <AutoCompleteCultura  
                                isExternalLoading={isLoading}
                                readonly
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <VTextField 
                                fullWidth 
                                label="Linha de crédito"
                                placeholder="Linha de crédito" 
                                name="linhacredito"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AutoCompletePessoa
                                isExternalLoading={isLoading}
                                nomeField="proponente"
                                label="Proponente"
                                readonly
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <AutoCompletePessoa
                                isExternalLoading={isLoading}
                                nomeField="avalista"
                                label="Avalista"
                                readonly
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <AutoCompletePessoa
                                isExternalLoading={isLoading}
                                nomeField="responsaveltecnico"
                                label="Responsável técnico"
                                readonly
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                label="Possui laudo de acompanhamento"
                                control={
                                    <VCheckBox 
                                        name="ehpossuilaudoacompanhamento"
                                        disabled 
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
                                InputLabelProps={{
                                    shrink: true
                                }}
                                inputProps={{
                                    readOnly: true
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
                                InputLabelProps={{
                                    shrink: true
                                }}
                                inputProps={{
                                    readOnly: true
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
                                    readOnly: true
                                }}
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
                                    readOnly: true
                                }}
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
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} md={3}>
                            <VTextField 
                                fullWidth
                                type="number"
                                label="Valor unitário"
                                placeholder="Valor unitário" 
                                name="valorunitariofinanciamento"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: "decimal",
                                    readOnly: true
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: "decimal",
                                    readOnly: true
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: "decimal",
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={8} md={3}>
                            <VTextField 
                                fullWidth
                                label="Origem do recurso próprio"
                                placeholder="Origem do recurso próprio" 
                                name="origemrecursoproprio"
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} md={3}>
                            <VTextField 
                                fullWidth
                                type="number"
                                label="Valor total do financiamento"
                                placeholder="Valor total do financiamento" 
                                name="valortotalfinanciamento"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: "decimal",
                                    readOnly: true
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    readOnly: true
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: "decimal",
                                    readOnly: true
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
                                        disabled
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
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} md={3}>
                            <VTextField 
                                fullWidth
                                label="Número de parcelas"
                                placeholder="Número de parcelas" 
                                name="numeroparcela"
                                type="number"
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} md={2}>
                            <VTextField 
                                fullWidth
                                label="Carência (meses)"
                                placeholder="Carência (meses)" 
                                name="carenciameses"
                                type="number"
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <VTextField 
                                fullWidth
                                label="Taxa de juros"
                                placeholder="Taxa de juros" 
                                name="taxajuros"
                                type="number"
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <VTextField 
                                fullWidth
                                label="Vencimento"
                                placeholder="Vencimento" 
                                name="vencimento"
                                type="datetime-local"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                inputProps={{
                                    readOnly: true
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
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item>
                        <Grid item xs={6}>
                            <Typography variant="h6">Assinatura proponente: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Assinatura responsável técnico: </Typography>
                        </Grid>
                    </Grid>
                </Grid> 
            </Box>
        </VForm>
    );  
};