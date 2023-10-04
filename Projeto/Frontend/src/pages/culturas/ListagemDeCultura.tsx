import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { CulturaService, IListagemCultura } from '../../shared/services/api/culturas/CulturaService';
import { useDebounce } from '../../shared/hooks';


export const ListagemDeCultura: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const [rows, setRows] = useState<IListagemCultura[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            CulturaService.getAll(1, busca)
            .then((result) => {
                setIsLoading(false);
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    console.log(result);

                    setRows(result.data);
                    setTotalCount(result.data.length);
                }
            });
        })

    }, [busca]);

    return(
        <LayoutBaseDePagina 
            titulo="Listagem de culturas"
            barraDeFerramentas={
                <FerramentasDaListagem 
                    textoBotaoNovo="Nova"
                    mostrarInputBusca
                    textoDaBusca={busca}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto}, {replace: true})}
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
                </Table>
            </TableContainer>
        </LayoutBaseDePagina>
    );
};