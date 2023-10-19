import { AxiosError } from 'axios';
import { useAuthContext } from '../../../../contexts';

export const errorInterceptor = (error: AxiosError) => {

    if (error.message === 'Network Error') {
        return Promise.reject(new Error('Erro de conexão.'));
    }

    if (error.response?.status === 401) {
        return Promise.reject(new Error('Você não está autorizado para acessar esse conteúdo, realize novamente o login ou verifique as permissões do seu usuário!'));
    }

    return Promise.reject(error.message);
};