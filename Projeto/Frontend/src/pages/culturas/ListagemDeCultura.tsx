import { useMemo, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { CulturaService } from '../../shared/services/api/culturas/CulturaService';
import { useDebounce } from '../../shared/hooks';

export const ListagemDeCultura: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce(3000);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {

        debounce(() => {
            CulturaService.getAll(1, busca)
            .then((result) => {
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    console.log(result);
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

        </LayoutBaseDePagina>
    );
};