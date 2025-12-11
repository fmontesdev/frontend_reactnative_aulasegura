/**
 * Interceptores de Axios para manejo de autenticación JWT
 * - authInterceptor: Añade automáticamente el access token a cada request
 * - errorInterceptor: Maneja errores 401 y refresca tokens automáticamente
 */

import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from '../constants';
import tokenService from './tokenService';

// Promesa compartida del refresh en proceso para evitar múltiples refresh simultáneos
let refreshTokenPromise: Promise<string | null> | null = null;

// Refresca el access token usando el refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Hace petición directa al endpoint de refresh (sin interceptores)
    const response = await axios.post(
      `${API_CONFIG.NESTJS_API_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Guarda los nuevos tokens
    await tokenService.saveTokens(accessToken, newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Si falla el refresh, elimina todos los tokens (logout)
    await tokenService.removeTokens();
    return null;
  }
};

// Interceptor de request: añade el access token automáticamente
export const authInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  try {
    const token = await tokenService.getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error adding auth token:', error);
  }
  return config;
};

// Interceptor de errores: maneja 401 y refresca tokens automáticamente
export const errorInterceptor = async (error: AxiosError): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // Log del error
  if (error.response) {
    console.error('API Error:', {
      status: error.response.status,
      data: error.response.data,
      url: originalRequest?.url,
    });
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Request Error:', error.message);
  }

  // Solo intenta refresh si:
  // 1. Es un error 401
  // 2. No es una ruta de auth (login, refresh, change-password)
  // 3. No se ha reintentado ya
  const isUnauthorized = error.response?.status === 401;
  const isAuthEndpoint =
    originalRequest?.url?.includes('/auth/login') ||
    originalRequest?.url?.includes('/auth/refresh') ||
    originalRequest?.url?.includes('/auth/change-password');

  if (isUnauthorized && !isAuthEndpoint && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;

    // Si no existe, inicia una nueva promesa de refresh
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshAccessToken().finally(() => {
        refreshTokenPromise = null; // Limpia cuando termina
      });
    }

    try {
      // Todas las peticiones esperan la misma promesa de refresh
      const newAccessToken = await refreshTokenPromise;

      if (newAccessToken) {
        // Reintenta la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }
    } catch (refreshError) {
      console.error('Refresh token failed:', refreshError);
    }
  }

  return Promise.reject(error);
};
