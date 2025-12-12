/**
 * Constantes globales de la app
 * Variables sensibles se leen desde process.env (soporte nativo de Expo)
 */

// Configuración de API
export const API_CONFIG = {
  NESTJS_API_URL: process.env.EXPO_PUBLIC_NESTJS_API_URL || 'http://localhost:8000',
  IMAGE_SERVER_URL: process.env.EXPO_PUBLIC_IMAGE_SERVER_URL || 'http://localhost:8090',
  API_TIMEOUT: 10000, // 10 segundos
};

// Otras constantes de la app (colores, textos, configuraciones de UI, etc.)
export const APP_CONFIG = {
  APP_NAME: 'Aula Segura',
  VERSION: '1.0.0',
};

// Exportar todo por defecto para facilitar imports
export default {
  ...API_CONFIG,
  ...APP_CONFIG,
};
