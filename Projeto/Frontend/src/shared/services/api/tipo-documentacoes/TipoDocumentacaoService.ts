import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalheTipoDocumentacao{
    id: number,
    sigla: string,
    nome: string,
    observacao: string
}

export interface IListagemTipoDocumentacao{
    id: number,
    sigla: string,
    nome: string
}

type TTipoDocumentacoesComTotalCount = {
    data: IListagemTipoDocumentacao[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TTipoDocumentacoesComTotalCount | Error> => {
    try {
      const urlRelativa = `/tipodocumentacao?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}&id=${id}`;
  
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


const getById = async (id: number): Promise<IDetalheTipoDocumentacao | Error> => {
    try {
        const { data } = await Api.get(`/tipodocumentacao/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheTipoDocumentacao, 'id'>): Promise<IDetalheTipoDocumentacao | Error> => { 
    try {
        const { data } = await Api.post('/tipodocumentacao', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalheTipoDocumentacao): Promise<void | Error> => { 
    try {
        await Api.put(`/tipodocumentacao/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/tipodocumentacao/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};


export const TipoDocumentacaoService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};