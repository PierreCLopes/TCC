import { Button } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { useEffect } from 'react';
import { Dashboard, DetalheDeCultura, DetalheDePessoa, ListagemDeCultura, ListagemDeImovel, ListagemDePessoa } from '../pages';
import { DetalheDeImovel } from '../pages/imoveis/DetalheDeImovel';
import { DetalheDeUsuario } from '../pages/usuarios/DetalheDeUsuario';
import { ListagemDeUsuario } from '../pages/usuarios/ListagemDeUsuario';

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
                label: 'Pessoas',
                path: '/pessoas',
                icon: 'people'
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
            },
            {
                label: 'Usuários',
                path: '/usuarios',
                icon: 'account_circle'
            },
        ])
    },[]);

    return(
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>

            <Route path="/pessoas" element={<ListagemDePessoa/>}/>
            <Route path="/pessoa/:id" element={<DetalheDePessoa/>}/>

            <Route path="/culturas" element={<ListagemDeCultura/>}/>
            <Route path="/cultura/:id" element={<DetalheDeCultura/>}/>

            <Route path="/imoveis" element={<ListagemDeImovel/>}/>
            <Route path="/imovel/:id" element={<DetalheDeImovel/>}/>

            <Route path="/usuarios" element={<ListagemDeUsuario/>}/>
            <Route path="/usuario/:id" element={<DetalheDeUsuario/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    )
}