import { Enviroment } from "../../../environment";
import { Api } from "../axios-config";

interface IDetalheCultura{
    id: number,
    precoKg: number,
    nome: string,
    observacao: string
}

interface IListagemCultura{
    id: number,
    precoKg: number,
    nome: string
}

type TCulturas = {
    data: IListagemCultura[];
}

const getAll = async (page = 1, filter = ''): Promise<TCulturas | Error> => { 
    try {
        const urlRelativa = `/cultura?page=${page}&pageSize=${Enviroment.LIMITE_DE_LINHAS}&nome=${filter}`;

        const { data } = await Api.get(urlRelativa);

        if(data){
            return{
                data
            };
        }

        return new Error('Erro ao listar os registros.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
    }
};

const getById = async (id: number): Promise<IDetalheCultura | Error> => {
    try {
        const { data } = await Api.get(`/cultura/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheCultura, 'id'>): Promise<IDetalheCultura | Error> => { 
    try {
        const { data } = await Api.post('/cultura', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalheCultura): Promise<void | Error> => { 
    try {
        await Api.put(`/cultura/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/cultura/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};


export const CulturaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};