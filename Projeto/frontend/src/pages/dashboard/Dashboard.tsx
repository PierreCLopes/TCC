import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const Dashboard = () => {
    return(
        <LayoutBaseDePagina 
            titulo='Página inicial' 
            barraDeFerramentas={(<FerramentasDaListagem mostrarInputBusca={true} textoBotaoNovo={'Nova'}/>)}
        >
            Testando
        </LayoutBaseDePagina>
    );
};