import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TableFooter, LinearProgress, Pagination } from '@mui/material';

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { CulturaService, IListagemCultura } from '../../shared/services/api/culturas/CulturaService';
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';


export const ListagemDeCultura: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const [rows, setRows] = useState<IListagemCultura[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            CulturaService.getAll(pagina, busca)
            .then((result) => {
                setIsLoading(false);
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    console.log(result);
                    console.log(result.totalCount);

                    setRows(result.data);
                    setTotalCount(result.totalCount);
                }
            });
        })

    }, [busca, pagina]);

    return(
        <LayoutBaseDePagina 
            titulo="Listagem de culturas"
            barraDeFerramentas={
                <FerramentasDaListagem 
                    textoBotaoNovo="Nova"
                    mostrarInputBusca
                    textoDaBusca={busca}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1'}, {replace: true})}
                ></FerramentasDaListagem>
            }
        >
            <TableContainer component={Paper} variant='outlined' sx={{ m: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Preço por Kg</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>{row.precokg}</TableCell>
                                <TableCell>Ações</TableCell>
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
                                        onChange={(e, newPage) => setSearchParams({ busca, pagina: newPage.toString()}, {replace: true})}
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