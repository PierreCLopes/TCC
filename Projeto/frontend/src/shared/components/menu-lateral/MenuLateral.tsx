import { Avatar, Box, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material"
import { ReactNode } from "react";
import { useDrawerContext } from "../../contexts";

interface IMenuLateralProps {
    children: ReactNode;
  }

export const MenuLateral: React.FC<IMenuLateralProps> = ({ children }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();

    return(
        <>
        <Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
            <Box width={theme.spacing(28)} height='100%' display='flex' flexDirection='column'>
                <Box width='100%' height={theme.spacing(20)} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Avatar sx={{height: theme.spacing(12), width: theme.spacing(12)}} src="https://s2.glbimg.com/cNcGRzTnqH-uXWP2RF66__GneE8=/0x0:439x273/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2023/U/C/V9PkuMSEu3hQDv1bzUmg/screenshot-201.png"/>
                </Box>

                <Divider/>

                <Box flex={1}>
                    <List component={'nav'}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Icon>home</Icon>
                            </ListItemIcon>  
                            <ListItemText primary='Página inicial'/>
                        </ListItemButton>
                    </List>
                </Box>
            </Box>
        </Drawer>

        <Box height='100vh' marginLeft={smDown ? 0 : theme.spacing(28)}>
            { children }
        </Box>
        </>
    );
};