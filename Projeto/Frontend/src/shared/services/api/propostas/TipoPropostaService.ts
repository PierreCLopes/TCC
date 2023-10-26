import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalheTipoProposta{
    id: number,
    nome: string,
    observacao: string,
    tipoDocumentacaoObrigatoria: number[]
}

export interface IListagemTipoProposta{
    id: number,
    nome: string
}

type TTipoPropostaComTotalCount = {
    data: IListagemTipoProposta[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TTipoPropostaComTotalCount | Error> => {
    try {
      const urlRelativa = `/tipoproposta?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}&id=${id}`;
  
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


const getById = async (id: number): Promise<IDetalheTipoProposta | Error> => {
    try {
        const { data } = await Api.get(`/tipoproposta/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheTipoProposta, 'id'>): Promise<IDetalheTipoProposta | Error> => { 
    try {
        const { data } = await Api.post('/tipoproposta', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalheTipoProposta): Promise<void | Error> => { 
    try {
        await Api.put(`/tipoproposta/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/tipoproposta/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};


export const TipoPropostaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};