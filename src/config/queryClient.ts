/**
 * Configuración global de TanStack Query
 */

import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '../errors/ApiError';

// Cliente de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reintentar hasta 2 veces ante fallos (útil en mobile con mala conexión)
      retry: (failureCount: number, error: unknown) => {
        // No reintentar errores de autenticación
        if (isApiError(error) && error.status === 401) return false;
        
        // No reintentar errores de validación (4xx excepto 401)
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false;
        
        // Reintentar hasta 2 veces para errores de red o servidor (5xx)
        return failureCount < 2;
      },
      
      // Tiers de staleTime por tipo de dato:
      //   60_000 (este default) — datos estáticos: usuarios, cursos, departamentos
      //   0 + refetchInterval: 10_000 — datos en tiempo real: logs de acceso, supervisión
      // Los hooks individuales sobreescriben este valor cuando lo necesitan.
      staleTime: 1000 * 60,
      
      // Recargar datos cuando la app vuelve al primer plano
      refetchOnWindowFocus: true,
      
      // Recargar datos cuando se reconecta la red
      refetchOnReconnect: true,
      
      // No recargar automáticamente cuando el componente se monta
      // (solo si los datos están obsoletos según staleTime)
      refetchOnMount: true,
    },
    mutations: {
      // Reintentar mutations solo una vez
      retry: (failureCount: number, error: unknown) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});
