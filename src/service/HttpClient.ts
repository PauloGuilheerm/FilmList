import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
});

client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error('Erro na resposta:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Erro na requisição:', error.request);
    } else {
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export const httpClient = {
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await client.get<T>(url, config);
    return response.data;
  },

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await client.post<T>(url, data, config);
    return response.data;
  },

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await client.put<T>(url, data, config);
    return response.data;
  },

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await client.patch<T>(url, data, config);
    return response.data;
  },

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await client.delete<T>(url, config);
    return response.data;
  },

  getInstance(): AxiosInstance {
    return client;
  },
};

export default httpClient;
