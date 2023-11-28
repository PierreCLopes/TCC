import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, AlertColor, Box } from '@mui/material';

import { FerramentasDaListagem, VAlert } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FilialService, IListagemFilial } from '../../shared/services/api/filiais/FilialService';
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';
import useUserPermissions from '../../shared/hooks/UseUserPermissions';

export const ListagemDeFilial: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemFilial[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Filial');

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            FilialService.getAll(pagina, busca)
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
        if(confirm('Deseja realmente excluir a filial?')){
            FilialService.deleteById(id)
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
            titulo="Listagem de filiais"
            barraDeFerramentas={
                <FerramentasDaListagem 
                    textoBotaoNovo="Nova"
                    mostrarInputBusca
                    mostrarBotaoNovo={permissions?.Editar}
                    textoDaBusca={busca}
                    aoClicarEmNovo={() => navigate(`/filial/nova`)}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, {replace: true})}
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
                            <TableCell>Nome</TableCell>
                            <TableCell>Sigla</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>{row.sigla}</TableCell>
                                <TableCell>

                                    <IconButton 
                                        size='small' 
                                        onClick={() => navigate(`/filial/${row.id}`)} 
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
