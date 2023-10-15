import { Button } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { useEffect } from 'react';
import { Dashboard, DetalheDeCultura, ListagemDeCultura, ListagemDeImovel } from '../pages';
import { DetalheDeImovel } from '../pages/imoveis/DetalheDeImovel';

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
            },
            {
                label: 'Imóveis',
                path: '/imoveis',
                icon: 'location_on'
            }
        ])
    },[]);

    return(
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>

            <Route path="/culturas" element={<ListagemDeCultura/>}/>
            <Route path="/cultura/:id" element={<DetalheDeCultura/>}/>

            <Route path="/imoveis" element={<ListagemDeImovel/>}/>
            <Route path="/imovel/:id" element={<DetalheDeImovel/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    )
}