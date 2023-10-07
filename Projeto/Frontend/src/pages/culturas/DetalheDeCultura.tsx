import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinearProgress, TextField } from "@mui/material";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { CulturaService } from "../../shared/services/api/culturas/CulturaService";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import { VTextField } from "../../shared/forms";

interface IFormData {
    nome: string;
    observacao: string;
    precokg: number;
}

export const DetalheDeCultura: React.FC = () => {
    const navigate = useNavigate();
    const {id = 'nova'} = useParams<'id'>();

    const formRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (id !== 'nova'){    

            setIsLoading(true);

            CulturaService.getById(Number(id))
            .then((result)=> {
                
                setIsLoading(false);

                if (result instanceof Error){
                    alert(result.message);
                    navigate('/culturas');

                } else {
                    console.log(result);
                    setNome(result.nome);

                    formRef.current?.setData(result);
                }
            })
        }
    }, [id])

    const handleSave = (dados: IFormData) => {

        setIsLoading(true);

        if(id === 'nova'){
            CulturaService.create(dados)
            .then((result) => {

                setIsLoading(false);

                if (result instanceof Error){
                    alert(result.message);

                } else {
                    alert('Registro criado com sucesso!');
                    navigate(`/cultura/${result.id}`)
                }  
            })
        } else {
            CulturaService.updateById(Number(id), {id: Number(id), ...dados})
            .then((result) => {

                setIsLoading(false);

                if (result instanceof Error){
                    alert(result.message);

                } else {
                    alert('Registro alterado com sucesso!');
                }  
            })
        }
    };

    const handleDelete = (id: number) => {
        if(confirm('Deseja realmente excluir a cultura?')){
            CulturaService.deleteById(id)
            .then(result => {
                if (result instanceof Error){
                    alert(result.message);
                } else {
                    alert('Registro apagado com sucesso!');
                    navigate('/culturas');
                }
            })
        }
    }

    return(
        <LayoutBaseDePagina 
            titulo={id === 'nova' ? 'Nova cultura' : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={id !== 'nova'}
                    mostrarBotaoApagar={id !== 'nova'}
     
                    aoClicarEmApagar={() => {handleDelete(Number(id))}}
                    aoClicarEmSalvar={() =>  formRef.current?.submitForm()}
                    aoClicarEmSalvarEFechar={() => {handleSave}}
                    aoClicarEmNovo={() => {navigate('/cultura/nova')}}
                    aoClicarEmVoltar={() => {navigate('/culturas')}}
                />
            }
        >
            <Form ref={formRef} onSubmit={handleSave}>
                <VTextField placeholder="Nome" name="nome" required={true}/>
                <VTextField placeholder="Preço por Kg" name="precokg" type="number" required={true}/>
                <VTextField placeholder="Observação" name="observacao"/>
            </Form>

            {isLoading &&(
                <LinearProgress variant="indeterminate"/>
            )}

            <p>DetalheDeCultura</p>
        </LayoutBaseDePagina>
    );
};