import { AlertColor, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { FerramentasDaListagem, FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useState } from "react";
import { PropostaService } from "../../shared/services/api/propostas/PropostaService";
import { PropostaLaudoService } from "../../shared/services/api/propostas/PropostaLaudoService";

export const Dashboard = () => {
    const [isLoadingImovel, setIsLoadingImovel] = useState(true);
    const [totalCountImovel, setTotalCountImovel] = useState(0);

    const [isLoadingCultura, setIsLoadingCultura] = useState(true);
    const [totalCountCultura, setTotalCountCultura] = useState(0);

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    useEffect(() => {
        setIsLoadingImovel(true);
        setIsLoadingCultura(true);

        PropostaService.getAll(1)
        .then((result) => {
            setIsLoadingImovel(false);
            
            if (result instanceof Error){
                setAlertMessage(result.message);
                setAlertSeverity("error");
            } else {
                setTotalCountImovel(result.totalCount);
            }
        });

        PropostaLaudoService.getAll(1)
        .then((result) => {
            setIsLoadingCultura(false);
            
            if (result instanceof Error){
                setAlertMessage(result.message);
                setAlertSeverity("error");
            } else {
                setTotalCountCultura(result.totalCount);
            }
        });

    }, []);

    return(
        <LayoutBaseDePagina 
            titulo='Página inicial' 
            alertMessage={alertMessage}
            alertSeverity={alertSeverity}
            onCloseAlert={() => setAlertMessage('')}
            barraDeFerramentas={(<FerramentasDaListagem mostrarBotaoNovo={false}/>)}
        >
            <Box width="100%" display="flex">
                <Grid container margin={2}>
                    <Grid container item spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        Propostas pendentes
                                    </Typography>

                                    <Box padding={6} display="flex" justifyContent="center" alignItems="center">
                                        {!isLoadingImovel &&(
                                            <Typography variant="h1">
                                                {totalCountImovel}
                                            </Typography>  
                                        )}

                                        {isLoadingImovel &&(
                                            <Typography variant="h6">
                                                Carregando...
                                            </Typography>
                                        )}  

                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        Laudos pendentes
                                    </Typography>

                                    <Box padding={6} display="flex" justifyContent="center" alignItems="center">
                                        {!isLoadingCultura &&(
                                            <Typography variant="h1">
                                                {totalCountCultura}
                                            </Typography>  
                                        )}

                                        {isLoadingCultura &&(
                                            <Typography variant="h6">
                                                Carregando...
                                            </Typography>
                                        )}   
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </LayoutBaseDePagina>
    );
};