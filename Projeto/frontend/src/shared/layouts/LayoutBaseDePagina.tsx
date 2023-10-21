import { Box, Icon, IconButton, Typography, useMediaQuery, useTheme, AlertColor } from "@mui/material";
import { useDrawerContext } from "../contexts";
import { VAlert } from "../components";

interface ILayoutBaseDePaginaProps{
    children: React.ReactNode;
    titulo: string;
    barraDeFerramentas?: React.ReactNode;
    alertMessage?: string;
    alertSeverity?: AlertColor;
    onCloseAlert?: () => void;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, barraDeFerramentas, alertMessage, alertSeverity, onCloseAlert = () => {}}) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const { toggleDrawerOpen } = useDrawerContext();

    return(
        <Box height={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
            <Box padding={1} display={'flex'} alignItems={'center'} gap={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)}>
                {smDown && 
                (<IconButton onClick={toggleDrawerOpen}>
                    <Icon>menu</Icon>
                </IconButton>)}

                <Typography 
                    variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
                    overflow={'hidden'}
                    whiteSpace={'nowrap'}
                    textOverflow={'ellipsis'}
                >
                    {titulo}
                </Typography>
            </Box>

            {barraDeFerramentas && (<Box>
                {barraDeFerramentas}
            </Box>)}

            {alertMessage &&(
                <Box margin={1}>
                    <VAlert
                        message={alertMessage}
                        onClose={onCloseAlert}
                        severity={alertSeverity}
                    />
                </Box>
            )}

            <Box flex={1} overflow={'auto'}>
                {children}
            </Box>

        </Box>
    );
};