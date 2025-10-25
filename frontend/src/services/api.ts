import axios from 'axios';

import {env} from '../config/env';
import {storage} from '../utils/storage';

export const api = axios.create({
  baseURL: env.apiUrl
});

api.interceptors.request.use(config => {
  const token = storage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      storage.clearToken();
      storage.clearUser();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
