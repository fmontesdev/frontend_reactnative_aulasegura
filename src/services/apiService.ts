/**
 * Servicio de API centralizado usando Axios
 * - Interceptor automático para JWT
 * - Refresh automático de tokens en 401
 * - Conexión al backend NestJS
 * - Manejo de errores centralizado
 * - Helper para URLs de imágenes
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../constants';
import { authInterceptor, errorInterceptor } from './apiInterceptors';

// Instancia singleton para NestJS
let apiInstance: AxiosInstance | null = null;

// Obtiene o crea la instancia de Axios para el backend NestJS
function getApiInstance(): AxiosInstance {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: API_CONFIG.NESTJS_API_URL,
      timeout: API_CONFIG.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor de request para agregar token
    apiInstance.interceptors.request.use(authInterceptor, errorInterceptor);

    // Interceptor de response para manejo de errores
    apiInstance.interceptors.response.use(
      (response) => response,
      errorInterceptor
    );
  }
  return apiInstance;
}

// Manejo centralizado de errores
const handleError = (error: any): never => {
  // Se puede personalizar el manejo de errores
  // Por ejemplo, mostrar notificaciones, redirigir al login en 401, etc.
  
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
  
  throw error;
};

// Servicio de API con métodos HTTP
const apiService = {
  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const instance = getApiInstance();
      const response = await instance.get<T>(url, config);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const instance = getApiInstance();
      const response = await instance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const instance = getApiInstance();
      const response = await instance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const instance = getApiInstance();
      const response = await instance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Update con PATCH request con ID en la URL
  async update<T>(url: string, id: string | number, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.patch<T>(`${url}/${id}`, data, config);
  },

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const instance = getApiInstance();
      const response = await instance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Construye URL completa para las imágenes del servidor estático
  getImageUrl(path: string): string {
    return `${API_CONFIG.IMAGE_SERVER_URL}${path.startsWith('/') ? path : `/${path}`}`;
  },
};

export default apiService;
