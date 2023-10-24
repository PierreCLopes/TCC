import { AxiosError } from 'axios';

export class ApiError {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}


export const errorInterceptor = (error: AxiosError) => {
  if (error.message === 'Network Error') {
    return Promise.reject(new Error('Erro de conexão.'));
  }

  if (error.response) {
    if (error.response.status === 401) {
      return Promise.reject(new Error('Você não está autorizado para acessar esse conteúdo, realize novamente o login!'));
    }

    if (error.response.status === 403) {
      return Promise.reject(new Error('Você não está autorizado para acessar esse conteúdo, verifique suas permissões de usuário!'));
    }

 
    const apiError = error.response.data as { statusCode: number, message: string };
    if (apiError && apiError.statusCode && apiError.message) {
      return Promise.reject(new Error(`Erro ${apiError.statusCode}: ${apiError.message}`));
    }

    // Caso nenhum dos casos específicos seja correspondido, trate como erro genérico
    return Promise.reject(new Error('Erro inesperado. Verifique sua conexão e tente novamente.'));
  }

  // Se não houver uma resposta (por exemplo, erro de rede), trate como erro genérico
  return Promise.reject(new Error('Erro inesperado. Verifique sua conexão e tente novamente.'));
};
