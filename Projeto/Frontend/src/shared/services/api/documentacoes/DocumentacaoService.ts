import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalheDocumentacao{
    id: number,
    nome: string,
    tipo: number,
    proposta: number,
    imovel: number,
    pessoa: number
}

export type IDetalheDocumentacaoComArquivo = IDetalheDocumentacao & {
    arquivo: File
} 

export interface IListagemDocumentacao{
    id: number,
    nome: string,
}

type TImoveisComTotalCount = {
    data: IListagemDocumentacao[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', proposta = '', imovel = '', pessoa = ''): Promise<TImoveisComTotalCount | Error> => {
    try {
      const urlRelativa = `/documentacao?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}&proposta=${proposta}&imovel=${imovel}&pessoa=${pessoa}`;
  
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


const getById = async (id: number): Promise<IDetalheDocumentacaoComArquivo | Error> => {
    try {
        const { data } = await Api.get(`/documentacao/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (file: File, dados: Omit<IDetalheDocumentacao, 'id'>): Promise<IDetalheDocumentacao | Error> => { 
    try {
        const formData = new FormData();
        formData.append('arquivo', file);
        formData.append('nome', dados.nome);
        formData.append('tipo', String(dados.tipo));
        formData.append('proposta', String(dados.proposta));
        formData.append('imovel', String(dados.imovel));
        formData.append('pessoa', String(dados.pessoa));
    
        const { data } = await Api.post(`/documentacao`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        if (data) {
          return data;
        }
    
        return new Error('Erro ao criar registro.');
      } catch (error) {
        console.error(error);
    
        return new Error((error as { message: string }).message || 'Erro ao criar registro.');
      }
};

const updateById = async (id: number, file: File, dados: Omit<IDetalheDocumentacao, 'id'>): Promise<void | Error> => { 
    try {
        const formData = new FormData();
        formData.append('arquivo', file);
        formData.append('nome', dados.nome);
        formData.append('tipo', String(dados.tipo));
        formData.append('proposta', String(dados.proposta));
        formData.append('imovel', String(dados.imovel));
        formData.append('pessoa', String(dados.pessoa));
    
        await Api.put(`/documentacao/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/documentacao/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};

export const DocumentacaoService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};