import { Box, Button, Divider, Icon, Paper, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";

interface IFerramentasDeDetalheProps{
    textoBotaoNovo?: string;

    mostrarBotaoNovo?: boolean;
    mostrarBotaoVoltar?: boolean;
    mostrarBotaoApagar?: boolean;
    mostrarBotaoSalvar?: boolean;
    mostrarBotaoSalvarEFechar?: boolean;

    mostrarBotaoNovoCarregando?: boolean;
    mostrarBotaoVoltarCarregando?: boolean;
    mostrarBotaoApagarCarregando?: boolean;
    mostrarBotaoSalvarCarregando?: boolean;
    mostrarBotaoSalvarEFecharCarregando?: boolean;

    aoClicarEmNovo?: () => void;
    aoClicarEmVoltar?: () => void;
    aoClicarEmApagar?: () => void;
    aoClicarEmSalvar?: () => void;
    aoClicarEmSalvarEFechar?: () => void;
}

export const FerramentasDeDetalhe: React.FC<IFerramentasDeDetalheProps> = ({textoBotaoNovo = 'Novo', 
                                                                            mostrarBotaoNovo = true, 
                                                                            mostrarBotaoVoltar = true,
                                                                            mostrarBotaoApagar = true,
                                                                            mostrarBotaoSalvar = true,
                                                                            mostrarBotaoSalvarEFechar = true,
                                                                            mostrarBotaoNovoCarregando = false, 
                                                                            mostrarBotaoVoltarCarregando = false,
                                                                            mostrarBotaoApagarCarregando = false,
                                                                            mostrarBotaoSalvarCarregando = false,
                                                                            mostrarBotaoSalvarEFecharCarregando = false,
                                                                            aoClicarEmNovo,
                                                                            aoClicarEmVoltar,
                                                                            aoClicarEmApagar,
                                                                            aoClicarEmSalvar,
                                                                            aoClicarEmSalvarEFechar}) => 
{
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

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
            {(mostrarBotaoSalvar && !mostrarBotaoSalvarCarregando) && (
                <Button 
                    color={'primary'}
                    variant={'contained'}
                    disableElevation
                    startIcon={<Icon>save</Icon>}
                    onClick={aoClicarEmSalvar}
                >
                    <Typography variant={'button'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
                        Salvar
                    </Typography>
                </Button>
            )}
            {mostrarBotaoSalvarCarregando && mostrarBotaoSalvar &&(
                <Skeleton width={110} height={60}/>
            )}

            {(mostrarBotaoSalvarEFechar && !mostrarBotaoSalvarEFecharCarregando && !smDown && !mdDown) && (
                <Button 
                    color={'primary'}
                    variant={'outlined'}
                    disableElevation
                    startIcon={<Icon>save</Icon>}
                    onClick={aoClicarEmSalvarEFechar}
                >
                    <Typography variant={'button'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
                        Salvar e fechar
                    </Typography>
                </Button>
            )}
            {(mostrarBotaoSalvarEFecharCarregando && !smDown && !mdDown && mostrarBotaoSalvarEFechar) && (
                <Skeleton width={180} height={60}/>
            )}

            {(mostrarBotaoApagar && !mostrarBotaoApagarCarregando) && (
                <Button 
                    color={'primary'}
                    variant={'outlined'}
                    disableElevation
                    startIcon={<Icon>delete</Icon>}
                    onClick={aoClicarEmApagar}
                >
                    <Typography variant={'button'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
                        Apagar
                    </Typography>
                </Button>
            )}
            {mostrarBotaoApagarCarregando && mostrarBotaoApagar &&(
                <Skeleton width={110} height={60}/>
            )}

            {(mostrarBotaoNovo && !mostrarBotaoNovoCarregando && !smDown) && (
                <Button 
                    color={'primary'}
                    variant={'outlined'}
                    disableElevation
                    startIcon={<Icon>add</Icon>}
                    onClick={aoClicarEmNovo}
                >
                    <Typography variant={'button'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
                        {textoBotaoNovo}
                    </Typography>
                </Button>
            )}
            {(mostrarBotaoNovoCarregando && !smDown && mostrarBotaoNovo) && (
                <Skeleton width={110} height={60}/>
            )}

            {mostrarBotaoVoltar && (mostrarBotaoApagar || mostrarBotaoNovo || mostrarBotaoSalvar || mostrarBotaoSalvarEFechar) &&(
                <Divider variant={'middle'} orientation={'vertical'}/>
            )}

            {(mostrarBotaoVoltar && !mostrarBotaoVoltarCarregando) && (
                <Button 
                    color={'primary'}
                    variant={'outlined'}
                    disableElevation
                    startIcon={<Icon>arrow_back</Icon>}
                    onClick={aoClicarEmVoltar}
                >
                    <Typography variant={'button'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
                        Voltar
                    </Typography>
                </Button>
            )}
            {mostrarBotaoVoltarCarregando && mostrarBotaoVoltar && (
                <Skeleton width={110} height={60}/>
            )}
        </Box>  
    );
};