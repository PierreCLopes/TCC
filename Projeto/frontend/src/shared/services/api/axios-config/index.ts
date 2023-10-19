import axios from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';
import { Environment } from '../../../environment';

const Api = axios.create({
  baseURL: Environment.URL_BASE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`,
  }
});

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
);

Api.interceptors.request.use(
  (config) => {
    // Recupere o token da localStorage e adicione ao cabeçalho de autorização
    const token = localStorage.getItem('APP_ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { Api };
