import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalheProposta{
    id: number,
    areafinanciada?: number,
    avalista?: number,
    carenciameses?: number,
    cultura: number
    data: Date,
    datacolheita?: Date,
    dataplantio?: Date,
    ehastecfinanciada?: boolean,
    ehpossuilaudoacompanhamento?: boolean,
    filial: number,
    linhacredito?: string,
    numeroparcela?: number,
    origemrecursoproprio?: string,
    prazomeses?: number,
    produtividadeesperada?: number,
    produtividademedia?: number,
    proponente: number,
    responsaveltecnico?: number,
    status?: number,
    taxajuros?: number,
    tipo: number,
    valorastec?: number,
    valortotalfinanciado?: number,
    valortotalfinanciamento?: number,
    valortotalorcamento?: number,
    valortotalrecursoproprio?: number,
    valorunitariofinanciamento?: number,
    vencimento?: Date,
    observacao?: string
}

export interface IListagemProposta{
    id: number,
    tiponome: string,
    proponentenome: string,
    data: Date,
    culturanome: string,
    filialsigla: string,
    status: number,
}

type TPropostaComTotalCount = {
    data: IListagemProposta[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TPropostaComTotalCount | Error> => {
    try {
      const urlRelativa = `/proposta?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}&id=${id}`;
  
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


const getById = async (id: number): Promise<IDetalheProposta | Error> => {
    try {
        const { data } = await Api.get(`/proposta/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheProposta, 'id'>): Promise<IDetalheProposta | Error> => { 
    try {
        const { data } = await Api.post('/proposta', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: IDetalheProposta): Promise<void | Error> => { 
    try {
        await Api.put(`/proposta/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/proposta/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};

const liberarById = async (id: number): Promise<IDetalheProposta | Error> => { 
    try {
        const { data } = await Api.post(`/proposta/liberar/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao liberar o registro.');
    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao liberar o registro.');
    }  
};

const voltarById = async (id: number): Promise<IDetalheProposta | Error> => { 
    try {
        const { data } = await Api.post(`/proposta/voltar/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao voltar o registro.');
    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao voltar o registro.');
    }  
};

export const PropostaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    liberarById,
    voltarById,
};