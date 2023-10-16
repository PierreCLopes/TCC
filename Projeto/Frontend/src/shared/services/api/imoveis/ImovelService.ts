import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalheImovel{
    id: number,
    observacao: string,
    nome: string,
    proprietario: number,
    matricula: string,
    areatotal: number,
    latitude: string,
    longitude: string,
    areaagricola: number,
    areapastagem: number,
    cidade: number,
    roteiroacesso: string
}

export type IDetalheImovelComArquivoKml = IDetalheImovel & {
    arquivokml: File
} 

export interface IListagemImovel{
    id: number,
    nome: string,
    matricula: string,
    areatotal: number
}

type TImoveisComTotalCount = {
    data: IListagemImovel[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TImoveisComTotalCount | Error> => {
    try {
      const urlRelativa = `/imovel?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&nome=${filter}`;
  
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


const getById = async (id: number): Promise<IDetalheImovelComArquivoKml | Error> => {
    try {
        const { data } = await Api.get(`/imovel/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheImovel, 'id'>): Promise<IDetalheImovel | Error> => { 
    try {
        const { data } = await Api.post('/imovel', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const updateById = async (id: number, dados: Omit<IDetalheImovel, 'id'>): Promise<void | Error> => { 
    try {
        await Api.put(`/imovel/${id}`, dados);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/imovel/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};

const uploadFile = async (id: number, file: File): Promise<void | Error> => {
    try {
      const formData = new FormData();
      formData.append('arquivokml', file);
  
      const { data } = await Api.post(`/imovel/${id}/uploadFile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (data) {
        return data;
      }
  
      return new Error('Erro ao fazer upload do arquivo.');
    } catch (error) {
      console.error(error);
  
      return new Error((error as { message: string }).message || 'Erro ao fazer upload do arquivo.');
    }
  };

export const ImovelService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    uploadFile
};