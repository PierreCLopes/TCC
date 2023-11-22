import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, AlertColor } from '@mui/material';

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';
import useUserPermissions from '../../shared/hooks/UseUserPermissions';
import { IListagemPropostaLaudoDiagnostico, PropostaLaudoDiagnosticoService } from '../../shared/services/api/propostas/PropostaLaudoDiagnosticoService';

export const ListagemDePropostaLaudoDiagnostico: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemPropostaLaudoDiagnostico[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const {propostaid} = useParams<'propostaid'>();
    const {propostalaudoid} = useParams<'propostalaudoid'>();

    const permissions = useUserPermissions('Proposta');

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            PropostaLaudoDiagnosticoService.getAll(Number(propostalaudoid), pagina)
            .then((result) => {
                setIsLoading(false);
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");
                } else {
                    setRows(result.data);
                    setTotalCount(result.totalCount);
                }
            });
        })

    }, [busca, pagina]);

    const handleDelete = (id: number) => {
        if(confirm('Deseja realmente excluir o diagnóstico do laudo?')){
            PropostaLaudoDiagnosticoService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");
                } else {
                    setRows(oldRows => {
                        return [
                            ...oldRows.filter(oldRow => oldRow.id !== id),
                        ]
                    });
                    setAlertMessage('Registro apagado com sucesso!');
                    setAlertSeverity("success");
                }
            })
        }
    }

    return (
        <LayoutBaseDePagina 
            titulo="Listagem de diagnósticos do laudo"
            barraDeFerramentas={
                <FerramentasDaListagem 
                    textoBotaoNovo="Novo"
                    mostrarInputBusca={false}
                    mostrarBotaoNovo={permissions?.Editar}
                    mostrarBotaoVoltar
                    textoDaBusca={busca}
                    aoClicarEmNovo={() => navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnostico/novo`)}
                    aoClicarEmVoltar={() => navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}`)}
                ></FerramentasDaListagem>
            }
            alertMessage={alertMessage}
            alertSeverity={alertSeverity}
            onCloseAlert={() => setAlertMessage('')}
        >
            <TableContainer component={Paper} variant='outlined' sx={{ m: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Diagnóstico</TableCell>
                            <TableCell>Nível</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.diagnostico}</TableCell>
                                <TableCell>{row.nivel}</TableCell>
                                <TableCell>

                                    <IconButton 
                                        size='small' 
                                        onClick={() => navigate(`/proposta/${propostaid}/propostalaudo/${propostalaudoid}/propostalaudodiagnostico/${row.id}`)} 
                                        disabled={!permissions?.Visualizar}
                                    >
                                        <Icon>edit</Icon>
                                    </IconButton>

                                    <IconButton 
                                        size='small' 
                                        onClick={() => handleDelete(row.id)} 
                                        disabled = {!permissions?.Excluir}
                                    >
                                        <Icon>delete</Icon>
                                    </IconButton>

                                </TableCell>
                            </TableRow> 
                        ))}

                    </TableBody>

                    {(totalCount === 0) && (!isLoading) && (
                        <caption>{Environment.LISTAGEM_VAZIA}</caption>
                    )}

                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={4}> 
                                    <LinearProgress variant='indeterminate'></LinearProgress>
                                </TableCell>
                            </TableRow>
                        )}
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={4}> 
                                    <Pagination 
                                        page={pagina}
                                        count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                                        onChange={(e, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, {replace: true})}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBaseDePagina>
    );
};
