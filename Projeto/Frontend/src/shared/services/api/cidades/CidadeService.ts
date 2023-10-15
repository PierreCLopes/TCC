import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IListagemCidade{
    id: number,
    nome: string,
    estado: number
}

type TCidadesComTotalCount = {
    data: IListagemCidade[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TCidadesComTotalCount | Error> => {
    try {
      const urlRelativa = `/cidade?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}&id=${id}`;
  
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


const getById = async (id: number): Promise<IListagemCidade | Error> => {
    try {
        const { data } = await Api.get(`/cidade/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

export const CidadeService = {
    getAll,
    getById
};