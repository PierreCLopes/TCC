import { useNavigate, useParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";


export const DetalheDeCultura: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'nova'} = useParams<'id'>();

    const handleSave = () => {

    };

    const handleDelete = () => {

    };

    return(
        <LayoutBaseDePagina 
            titulo="Detalhe de cultura"
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={id !== 'nova'}
                    mostrarBotaoApagar={id !== 'nova'}
     
                    aoClicarEmApagar={() => {handleDelete}}
                    aoClicarEmSalvar={() => {handleSave}}
                    aoClicarEmSalvarEFechar={() => {handleSave}}
                    aoClicarEmNovo={() => {navigate('/cultura/nova')}}
                    aoClicarEmVoltar={() => {navigate('/culturas')}}
                />
            }
        >
            <p>DetalheDeCultura</p>
        </LayoutBaseDePagina>
    );
};