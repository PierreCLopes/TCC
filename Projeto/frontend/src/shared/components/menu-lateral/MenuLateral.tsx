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