import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalheUsuario{
    id: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface IListagemUsuario{
    id: string,
    email: string,
}

type TUsuariosComTotalCount = {
    data: IListagemUsuario[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TUsuariosComTotalCount | Error> => {
    try {
      const urlRelativa = `/Auth/usuarios?page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}&userName=${filter}&id=${id}`;
  
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


const getById = async (id: string): Promise<IDetalheUsuario | Error> => {
    try {
        const { data } = await Api.get(`/Auth/usuario/${id}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheUsuario, 'id'>): Promise<IDetalheUsuario | Error> => { 
    try {
        const { data } = await Api.post('/Auth/usuario', dados);

        if(data){
            return data;
        }

        return new Error('Erro ao criar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
    }  
};

const deleteById = async (id: string): Promise<void | Error> => { 
    try {
        await Api.delete(`/Auth/usuario/${id}`);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao excluir o registro.');
    }  
};


export const UsuarioService = {
    getAll,
    getById,
    create,
    deleteById
};