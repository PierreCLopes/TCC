import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, AlertColor } from '@mui/material';

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';
import { PessoaService, IListagemPessoa } from '../../shared/services/api/pessoas/PessoaService';
import useUserPermissions from '../../shared/hooks/UseUserPermissions';


export const ListagemDePessoa: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemPessoa[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [alertMessage, setAlertMessage] = useState(''); 
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("info"); 

    const permissions = useUserPermissions('Pessoa');

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            PessoaService.getAll(pagina, busca)
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
        if(confirm('Deseja realmente excluir a pessoa?')){
            PessoaService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    setAlertMessage(result.message);
                    setAlertSeverity("error");
                } else {
                    setRows(oldRows =>{
                        return[
                            ...oldRows.filter(oldRow => oldRow.id !== id),
                        ]
                    });
                    setAlertMessage('Registro apagado com sucesso!');
                    setAlertSeverity("success");
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo="Listagem de pessoas"
            alertMessage={alertMessage}
            alertSeverity={alertSeverity}
            onCloseAlert={() => setAlertMessage('')}
            barraDeFerramentas={
                <FerramentasDaListagem 
                    textoBotaoNovo="Nova"
                    mostrarBotaoNovo={permissions?.Editar}
                    mostrarInputBusca
                    textoDaBusca={busca}
                    aoClicarEmNovo={() => navigate(`/pessoa/nova`)}
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
                            <TableCell>CNPJ/CPF</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>{row.cnpjcpf}</TableCell>
                                <TableCell>{row.telefone}</TableCell>
                                <TableCell>

                                    <IconButton size='small' onClick={() => navigate(`/pessoa/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>

                                    {permissions?.Excluir &&(
                                        <IconButton size='small' onClick={() => handleDelete(row.id)}>
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    )}

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