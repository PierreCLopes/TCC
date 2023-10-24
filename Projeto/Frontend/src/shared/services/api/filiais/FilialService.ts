import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalheFilial{
    id: number,
    nome: string,
    pessoa: number,
    sigla: string,
    observacao: string
}

export interface IListagemFilial{
    id: number,
    nome: string,
    sigla: string
}

type TFiliaisComTotalCount = {
    data: IListagemFilial[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TFiliaisComTotalCount | Error> => {
    try {
      const urlRelativa = `/filial?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}&id=${id}`;
  
      const { data, headers } = await Api.get(urlRelativa);

      if (data) {
        return {
          data,
          totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
        };
      }
  
      return new Error('Erro ao listar os registros.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
  };


const getById = async (id: number): Promise<IDetalheFilial | Error> => {
    try {
        const { data } = await Api.get(`/filial/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheFilial, 'id'>): Promise<IDetalheFilial | Error> => { 
    try {
        const { data } = await Api.post('/filial', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalheFilial): Promise<void | Error> => { 
    try {
        await Api.put(`/filial/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/filial/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};


export const FilialService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};