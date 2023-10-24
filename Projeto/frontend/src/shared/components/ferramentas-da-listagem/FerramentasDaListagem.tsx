import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material";
import { Environment } from "../../environment";

interface IBarraDeFerramentasProps{
    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    aoMudarTextoDeBusca?: (novoTexto: string) => void;

    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoClicarEmNovo?: () => void;
    aoClicarEmVoltar?: () => void;
}

export const FerramentasDaListagem: React.FC<IBarraDeFerramentasProps> = ({textoDaBusca = '', 
                                                                        mostrarInputBusca = false, 
                                                                        aoMudarTextoDeBusca,
                                                                        textoBotaoNovo = 'Novo',
                                                                        mostrarBotaoNovo = true,
                                                                        aoClicarEmNovo,
                                                                        aoClicarEmVoltar}) => {
    const theme = useTheme();

    return(
        <Box 
            gap={1} 
            marginX={1} 
            padding={1} 
            paddingX={2}   
            display={'flex'} 
            alignItems={'center'} 
            height={theme.spacing(5)} 
            component={Paper}
        >
            {mostrarInputBusca && (
                <TextField 
                    size={'small'} 
                    placeholder={Environment.INPUT_DE_BUSCA} 
                    value={textoDaBusca}
                    onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
                />
            )}

            <Box flex={50} display={'flex'} justifyContent={'end'}>
                {mostrarBotaoNovo &&(
                    <Button 
                        color={'primary'}
                        variant={'outlined'}
                        disableElevation
                        endIcon={<Icon>arrow_back</Icon>}
                        onClick={aoClicarEmVoltar}
                    >
                        Voltar
                    </Button>
                )}
            </Box>

            <Box flex={1} display={'flex'} justifyContent={'end'}>
                {mostrarBotaoNovo &&(
                    <Button 
                        color={'primary'}
                        variant={'contained'}
                        disableElevation
                        endIcon={<Icon>add</Icon>}
                        onClick={aoClicarEmNovo}
                    >
                        {textoBotaoNovo}
                    </Button>
                )}
            </Box>
        </Box>
    );
};