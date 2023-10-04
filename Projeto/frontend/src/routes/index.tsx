import { Button } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { useEffect } from 'react';
import { Dashboard, ListagemDeCultura } from '../pages';

export const AppRoutes = () => {
    const { toggleDrawerOpen, setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                path: '/home',
                icon: 'home'
            },
            {
                label: 'Culturas',
                path: '/culturas',
                icon: 'spa'
            }
        ])
    },[]);

    return(
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>
            <Route path="/culturas" element={<ListagemDeCultura/>}/>
            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    )
}