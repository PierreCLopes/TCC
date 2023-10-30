import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalhePropostaLaudoDiagnostico{
    id: number,
    propostalaudo: number,
    areaafetada: number,
    nivel: string,
    diagnostico: string,
    observacao?: string,
    ehalterouprodutividade: boolean,
    ehfazercontrole: boolean
}

export interface IListagemPropostaLaudoDiagnostico{
    id: number,
    nivel: string,
    diagnostico: string,
}

type TPropostaImovelComTotalCount = {
    data: IListagemPropostaLaudoDiagnostico[];
    totalCount: number;
}

const getAll = async (propostaid: number, page = 1): Promise<TPropostaImovelComTotalCount | Error> => {
    try {
      const urlRelativa = `/propostalaudodiagnostico/propostalaudo/${propostaid}?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}`;
  
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


const getById = async (id: number): Promise<IDetalhePropostaLaudoDiagnostico | Error> => {
    try {
        const { data } = await Api.get(`/propostalaudodiagnostico/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalhePropostaLaudoDiagnostico, 'id'>): Promise<IDetalhePropostaLaudoDiagnostico | Error> => { 
    try {
        const { data } = await Api.post('/propostalaudodiagnostico', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalhePropostaLaudoDiagnostico): Promise<void | Error> => { 
    try {
        await Api.put(`/propostalaudodiagnostico/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/propostalaudodiagnostico/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};


export const PropostaLaudoDiagnosticoService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};