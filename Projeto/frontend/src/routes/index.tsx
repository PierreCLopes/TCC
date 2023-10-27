import { Button } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { useEffect } from 'react';
import { Dashboard, 
         DetalheDePermissaoUsuario, 
         ListagemDePermissaoUsuario, 
         DetalheDePessoa, 
         ListagemDeImovel, 
         ListagemDePessoa, 
         ListagemDePropostaImovel, 
         DetalheDeFilial, 
         DetalheDeImovel, 
         DetalheDeUsuario, 
         ListagemDeFilial,
         ListagemDeTipoDocumentacao,
         DetalheDeTipoDocumentacao,
         ListagemDeUsuario,
         DetalheDePropostaImovel,
         ListagemDeDocumentacao,
         DetalheDeDocumentacao,
         DetalheDeTipoProposta,
         ListagemDeProposta,
         ListagemDeTipoProposta,
         DetalheDeProposta} from '../pages';
import useUserPermissions from '../shared/hooks/UseUserPermissions';

export const AppRoutes = () => {
    const {setDrawerOptions } = useDrawerContext();
    
    // Retrieve user permissions for each class
    const pessoasPermissions = useUserPermissions('Pessoa');
    const culturasPermissions = useUserPermissions('Cultura');
    const imoveisPermissions = useUserPermissions('Imovel');
    const usuariosPermissions = useUserPermissions('Usuario');
    const filiaisPermissions = useUserPermissions('Filial');
    const documentacoesPermissions = useUserPermissions('Documentacao');
    const propostasPermissions = useUserPermissions('Proposta');

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
                label: 'Propostas',
                path: '/propostas',
                icon: 'request_quote',
                disabled: !propostasPermissions?.Visualizar,
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
            {
                label: 'Filiais',
                path: '/filiais',
                icon: 'business',
                disabled: !filiaisPermissions?.Visualizar,
            },
            {
                label: 'Tipos de doc.',
                path: '/tipodocumentacoes',
                icon: 'source',
                disabled: !documentacoesPermissions?.Visualizar,
            },
            {
                label: 'Tipos de proposta',
                path: '/tiposproposta',
                icon: 'sticky_note_2',
                disabled: !propostasPermissions?.Visualizar,
            },
        ])
    }, [pessoasPermissions, culturasPermissions, imoveisPermissions, usuariosPermissions, filiaisPermissions, documentacoesPermissions]);


    return(
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>

            <Route path="/pessoas" element={<ListagemDePessoa/>}/>
            <Route path="/pessoa/:id" element={<DetalheDePessoa/>}/>
            <Route path="/pessoa/:pessoaid/documentacoes" element={<ListagemDeDocumentacao/>}/>
            <Route path="/pessoa/:pessoaid/documentacao/:id" element={<DetalheDeDocumentacao/>}/>

            <Route path="/culturas" element={<ListagemDePropostaImovel/>}/>
            <Route path="/cultura/:id" element={<DetalheDePropostaImovel/>}/>

            <Route path="/imoveis" element={<ListagemDeImovel/>}/>
            <Route path="/imovel/:id" element={<DetalheDeImovel/>}/>

            <Route path="/usuarios" element={<ListagemDeUsuario/>}/>
            <Route path="/usuario/:id" element={<DetalheDeUsuario/>}/>

            <Route path="/usuario/:userId/permissoes" element={<ListagemDePermissaoUsuario/>}/>
            <Route path="/usuario/:userId/permissao/:tipo" element={<DetalheDePermissaoUsuario/>}/>

            <Route path="/filiais" element={<ListagemDeFilial/>}/>
            <Route path="/filial/:id" element={<DetalheDeFilial/>}/>

            <Route path="/tipodocumentacoes" element={<ListagemDeTipoDocumentacao/>}/>
            <Route path="/tipodocumentacao/:id" element={<DetalheDeTipoDocumentacao/>}/>

            <Route path="/tiposproposta" element={<ListagemDeTipoProposta/>}/>
            <Route path="/tipoproposta/:id" element={<DetalheDeTipoProposta/>}/>

            <Route path="/propostas" element={<ListagemDeProposta/>}/>
            <Route path="/proposta/:id" element={<DetalheDeProposta/>}/>
            <Route path="/proposta/:propostaid/documentacoes" element={<ListagemDeDocumentacao/>}/>
            <Route path="/proposta/:propostaid/documentacao/:id" element={<DetalheDeDocumentacao/>}/>
            <Route path="/proposta/:propostaid/propostaimoveis" element={<ListagemDePropostaImovel/>}/>
            <Route path="/proposta/:propostaid/propostaimovel/:id" element={<DetalheDePropostaImovel/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    )
}