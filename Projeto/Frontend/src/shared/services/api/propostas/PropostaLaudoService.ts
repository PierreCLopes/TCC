import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalhePropostaLaudo{
    id: number,
    proposta: number,
    datalaudo?: Date,
    datavistoria?: Date,
    ehareacultivadafinanciada?: boolean,
    ehcreditoaplicadocorreto?: boolean,
    ehatendendorecomendacao?: boolean,
    ehcroquiidentificaarea?: boolean,
    ehepocaplantiozoneamento?: boolean,
    ehlavouraplantadafinanciada?: boolean,
    ehpossuiarearecursoproprio?: boolean,
    observacao?: string,
    produtividadeobtida?: number,
    produtividadeplano?: number,
    situacaoempreendimento?: string,
    sequencial: number,
    status?: number
}

export interface IListagemPropostaLaudo{
    id: number,
    sequencial: number
    datalaudo: Date,
    datavistoria: Date,
    status: number
}

type TPropostaLaudoComTotalCount = {
    data: IListagemPropostaLaudo[];
    totalCount: number;
}

const getAll = async (propostaid: number, page = 1): Promise<TPropostaLaudoComTotalCount | Error> => {
    try {
      const urlRelativa = `/propostalaudo/proposta/${propostaid}?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}`;
  
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


const getById = async (id: number): Promise<IDetalhePropostaLaudo | Error> => {
    try {
        const { data } = await Api.get(`/propostalaudo/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const getPendente = async (): Promise<number | Error> => {
    try {
        const { data } = await Api.get('/propostalaudo/pendente');
        
        return data;

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalhePropostaLaudo, 'id'>): Promise<IDetalhePropostaLaudo | Error> => { 
    try {
        const { data } = await Api.post('/propostalaudo', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalhePropostaLaudo): Promise<void | Error> => { 
    try {
        await Api.put(`/propostalaudo/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/propostalaudo/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};

const liberarById = async (id: number): Promise<IDetalhePropostaLaudo | Error> => { 
    try {
        const { data } = await Api.post(`/propostalaudo/liberar/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao liberar o registro.');
    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao liberar o registro.');
    }  
};

const voltarById = async (id: number): Promise<IDetalhePropostaLaudo | Error> => { 
    try {
        const { data } = await Api.post(`/propostalaudo/voltar/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao voltar o registro.');
    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao voltar o registro.');
    }  
};

export const PropostaLaudoService = {
    getAll,
    getById,
    getPendente,
    create,
    updateById,
    deleteById,
    liberarById,
    voltarById
};