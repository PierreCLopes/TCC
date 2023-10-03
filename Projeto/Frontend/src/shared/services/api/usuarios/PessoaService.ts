import { Api } from "../axios-config";

interface IPessoa{
    id: number,
}

interface IListagemPessoa{
    
}

const getAll = async (): Promise<any> => { 
    try {
        const { data } = await Api.get('/usuarios');
    } catch (error) {
        
    }
};

const getById = async (): Promise<any> => { };

const create = async (): Promise<any> => { };

const updateById = async (): Promise<any> => { };

const deleteById = async (): Promise<any> => { };


export const PessoaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};