import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalhePropostaImovel{
    id: number,
    area: number,
    imovel: number,
    proposta: number
}

export interface IListagemPropostaImovel{
    id: number,
    area: number,
    imovelnome: string
}

type TPropostaImovelComTotalCount = {
    data: IListagemPropostaImovel[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TPropostaImovelComTotalCount | Error> => {
    try {
      const urlRelativa = `/propostaimovel?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}`;
  
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


const getById = async (id: number): Promise<IDetalhePropostaImovel | Error> => {
    try {
        const { data } = await Api.get(`/propostaimovel/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalhePropostaImovel, 'id'>): Promise<IDetalhePropostaImovel | Error> => { 
    try {
        const { data } = await Api.post('/propostaimovel', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalhePropostaImovel): Promise<void | Error> => { 
    try {
        await Api.put(`/propostaimovel/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/propostaimovel/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};


export const PropostaImovelService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};