import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IDetalhePermissaoUsuario{
    tipo: string,
    userId: string,
    valor: string,
}

export interface IListagemPermissaoUsuario{
    tipo: string,
    valor: string,
}

type TPermissoesUsuarioComTotalCount = {
    data: IListagemPermissaoUsuario[];
    totalCount: number;
}

const getAll = async (userid: string): Promise<TPermissoesUsuarioComTotalCount | Error> => {
    try {
      const urlRelativa = `claims/${userid}`;
  
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


const getById = async (userid: string, tipo: string): Promise<IDetalhePermissaoUsuario | Error> => {
    try {
        const { data } = await Api.get(`claims/${userid}/${tipo}`);

        if(data){
            return data;
        }

        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao consultar o registro.');
    }
};

const updateById = async (userid: string, tipo: string, novovalor: IDetalhePermissaoUsuario): Promise<void | Error> => { 
    try {
        await Api.put(`/claims/${userid}/${tipo}`, novovalor);

    } catch (error) {
        console.error(error);

        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
    }  
};

export const PermissaoUsuarioService = {
    getAll,
    getById,
    updateById,
};