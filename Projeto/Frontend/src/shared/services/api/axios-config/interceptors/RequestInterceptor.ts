import { AsyncLocalStorage } from 'async_hooks';
import { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = (request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if(token){
        request.headers.Authorization = `Bearer ${token}`;
    }
    
    return request;
}