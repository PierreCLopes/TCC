import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalhePessoa{
    id: number,
    nome: string,
    apelido: string,
    cnpjcpf: string,
    telefone: string,
    observacao: string,
    rg: string,
    email: string,
    ehtecnico: boolean,
    cfta: string,
    tipo: number,
    endereco: {
        bairro: string,
        cep: string,
        cidade: number
    }
}

export interface IListagemPessoa{
    id: number,
    nome: string,
    cnpjcpf: string,
    telefone: string,
}

type TPessoasComTotalCount = {
    data: IListagemPessoa[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TPessoasComTotalCount | Error> => {
    try {
      const urlRelativa = `/pessoa?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}&id=${id}`;
  
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


const getById = async (id: number): Promise<IDetalhePessoa | Error> => {
    try {
        const { data } = await Api.get(`/pessoa/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalhePessoa, 'id'>): Promise<IDetalhePessoa | Error> => { 
    try {
        const { data } = await Api.post('/pessoa', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: Omit<IDetalhePessoa, 'id'>): Promise<void | Error> => { 
    try {
        await Api.put(`/pessoa/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/pessoa/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};

export const PessoaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};