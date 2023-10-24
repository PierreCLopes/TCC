import { Button } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { useEffect } from 'react';
import { Dashboard, DetalheDePermissaoUsuario, ListagemDePermissaoUsuario, DetalheDePessoa, ListagemDeImovel, ListagemDePessoa, ListagemDeCultura, DetalheDeCultura } from '../pages';
import { DetalheDeImovel } from '../pages/imoveis/DetalheDeImovel';
import { DetalheDeUsuario } from '../pages/usuarios/DetalheDeUsuario';
import { ListagemDeUsuario } from '../pages/usuarios/ListagemDeUsuario';
import useUserPermissions from '../shared/hooks/UseUserPermissions';

export const AppRoutes = () => {
    const {setDrawerOptions } = useDrawerContext();
    
    // Retrieve user permissions for each class
    const pessoasPermissions = useUserPermissions('Pessoa');
    const culturasPermissions = useUserPermissions('Cultura');
    const imoveisPermissions = useUserPermissions('Imovel');
    const usuariosPermissions = useUserPermissions('Usuario');

    useEffect(() => {
        // Set drawer options based on permissions
        setDrawerOptions([
            {
                label: 'Página inicial',
                path: '/home',
                icon: 'home',
                disabled: false,
            },
            {
                label: 'Pessoas',
                path: '/pessoas',
                icon: 'people',
                disabled: !pessoasPermissions?.Visualizar,
            },
            {
                label: 'Culturas',
                path: '/culturas',
                icon: 'spa',
                disabled: !culturasPermissions?.Visualizar,
            },
            {
                label: 'Imóveis',
                path: '/imoveis',
                icon: 'location_on',
                disabled: !imoveisPermissions?.Visualizar,
            },
            {
                label: 'Usuários',
                path: '/usuarios',
                icon: 'account_circle',
                disabled: !usuariosPermissions?.Visualizar,
            },
        ])
    }, [pessoasPermissions, culturasPermissions, imoveisPermissions, usuariosPermissions]);


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

            <Route path="/usuario/:userId/permissoes" element={<ListagemDePermissaoUsuario/>}/>
            <Route path="/usuario/:userId/permissao/:tipo" element={<DetalheDePermissaoUsuario/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    )
}