import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon } from '@mui/material';

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';
import { IListagemImovel, ImovelService } from '../../shared/services/api/imoveis/ImovelService';


export const ListagemDeImovel: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemImovel[]>([]);
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
            ImovelService.getAll(pagina, busca)
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

    const handleDelete = (id: number) => {
        if(confirm('Deseja realmente excluir o imóvel?')){
            ImovelService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    setRows(oldRows =>{
                        return[
                            ...oldRows.filter(oldRow => oldRow.id !== id),
                        ]
                    });
                    alert('Registro apagado com sucesso!');
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo="Listagem de imóveis"
            barraDeFerramentas={
                <FerramentasDaListagem 
                    textoBotaoNovo="Novo"
                    mostrarInputBusca
                    textoDaBusca={busca}
                    aoClicarEmNovo={() => navigate(`/imovel/novo`)}
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
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Área total (ha)</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>{row.matricula}</TableCell>
                                <TableCell>{row.areatotal}</TableCell>
                                <TableCell>
                                    <IconButton size='small' onClick={() => navigate(`/imovel/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                    <IconButton size='small' onClick={() => handleDelete(row.id)}>
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