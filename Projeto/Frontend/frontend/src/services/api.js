import axios from 'axios';

const api = axios.create(
  {
    baseURL:"https://localhost:7133/api",
  }
)

export default api;