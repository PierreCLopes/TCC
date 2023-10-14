import axios from 'axios';
import { errorInterceptor, responseInterceptor, requestInterceptor } from './interceptors';
import { Environment } from '../../../environment';

const Api = axios.create(
  {
    baseURL: Environment.URL_BASE,
  }
);

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
);

Api.interceptors.request.use(
  (request) => requestInterceptor(request),
  (error) => errorInterceptor(error)
);

export { Api };