import { Avatar, Box, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material"
import { ReactNode } from "react";
import { useAppThemeContext, useAuthContext, useDrawerContext } from "../../contexts";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

interface IMenuLateralProps {
    children: ReactNode;
}

interface IListItemLink{
    to: string;
    icon: string;
    label: string;
    disabled: boolean;
    onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLink> = ({ to, icon, label, disabled, onClick }) => {
    const navigate = useNavigate();

    const resolvedPath = useResolvedPath(to);
    const match = useMatch({ path: resolvedPath.pathname, end: false });

    const handleClick = () => {
        navigate(to);
        onClick?.();
    };

    return(
        <ListItemButton selected={!!match} onClick={handleClick} disabled={disabled}>
            <ListItemIcon>
                <Icon>{icon}</Icon>
            </ListItemIcon>  
            <ListItemText primary={label}/>
        </ListItemButton>
    );
};

export const MenuLateral: React.FC<IMenuLateralProps> = ({ children }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
    const { toggleTheme } = useAppThemeContext();
    const { logout } = useAuthContext();

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
                        {drawerOptions.map(drawerOptions => (
                            <ListItemLink
                                key={drawerOptions.path}
                                icon={drawerOptions.icon}
                                to={drawerOptions.path}
                                label={drawerOptions.label}
                                disabled={drawerOptions.disabled}
                                onClick={smDown ? toggleDrawerOpen : undefined}
                            />
                        ))}
                    </List>
                </Box>
                <Box>
                    <List component={'nav'}>
                        <ListItemButton onClick={toggleTheme}>
                            <ListItemIcon>
                                <Icon>dark_mode</Icon>
                            </ListItemIcon>  
                            <ListItemText primary={'Alternar tema'}/>
                        </ListItemButton>
                        <ListItemButton onClick={logout}>
                            <ListItemIcon>
                                <Icon>logout</Icon>
                            </ListItemIcon>  
                            <ListItemText primary={'Sair'}/>
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