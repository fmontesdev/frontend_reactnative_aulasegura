/**
 * Servicio de almacenamiento multiplataforma de tokens para autenticación JWT
 * - iOS/Android: expo-secure-store (cifrado)
 * - Web: localStorage
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Factory para crear métodos de token específicos
const createTokenMethods = (key: string) => {
  const methods = {
    async save(token: string): Promise<void> {
      try {
        isWeb ? localStorage.setItem(key, token) : await SecureStore.setItemAsync(key, token);
      } catch (error) {
        console.error(`Error saving token (${key}):`, error);
        throw new Error(`Failed to save token`);
      }
    },

    async get(): Promise<string | null> {
      try {
        return isWeb ? localStorage.getItem(key) : await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error(`Error getting token (${key}):`, error);
        return null;
      }
    },

    async remove(): Promise<void> {
      try {
        isWeb ? localStorage.removeItem(key) : await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error(`Error removing token (${key}):`, error);
        throw new Error(`Failed to remove token`);
      }
    },

    async has(): Promise<boolean> {
      const value = await methods.get();
      return value !== null && value !== '';
    },
  };

  return methods;
};

// Crear métodos para cada tipo de token
const accessToken = createTokenMethods('access_token');
const refreshToken = createTokenMethods('refresh_token');

const tokenService = {
  // Access Token
  saveAccessToken: accessToken.save,
  getAccessToken: accessToken.get,
  removeAccessToken: accessToken.remove,
  hasAccessToken: accessToken.has,

  // Refresh Token
  saveRefreshToken: refreshToken.save,
  getRefreshToken: refreshToken.get,
  removeRefreshToken: refreshToken.remove,
  hasRefreshToken: refreshToken.has,

  // Operaciones combinadas
  async saveTokens(access: string, refresh: string): Promise<void> {
    await Promise.all([accessToken.save(access), refreshToken.save(refresh)]);
  },

  async removeTokens(): Promise<void> {
    await Promise.all([accessToken.remove(), refreshToken.remove()]);
  },
};

export default tokenService;
