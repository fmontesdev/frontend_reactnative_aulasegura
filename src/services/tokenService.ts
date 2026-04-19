/**
 * Servicio de almacenamiento multiplataforma de tokens para autenticación JWT
 * - Web: access token en variable de módulo (memoria). Refresh token: httpOnly cookie (browser lo gestiona)
 * - iOS/Android: expo-secure-store (cifrado) para ambos tokens
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Web: access token en memoria (nunca en localStorage)
let _accessToken: string | null = null;

const tokenService = {
  async saveAccessToken(token: string): Promise<void> {
    if (isWeb) {
      _accessToken = token;
    } else {
      await SecureStore.setItemAsync('access_token', token);
    }
  },

  async getAccessToken(): Promise<string | null> {
    if (isWeb) {
      return _accessToken;
    }
    return SecureStore.getItemAsync('access_token');
  },

  async removeAccessToken(): Promise<void> {
    if (isWeb) {
      _accessToken = null;
    } else {
      await SecureStore.deleteItemAsync('access_token');
    }
  },

  async hasAccessToken(): Promise<boolean> {
    const token = await tokenService.getAccessToken();
    return token !== null && token !== '';
  },

  // Web: no-ops — el browser gestiona el refreshToken como httpOnly cookie
  // Native: SecureStore
  async saveRefreshToken(token: string): Promise<void> {
    if (isWeb) return;
    await SecureStore.setItemAsync('refresh_token', token);
  },

  async getRefreshToken(): Promise<string | null> {
    if (isWeb) return null;
    return SecureStore.getItemAsync('refresh_token');
  },

  async removeRefreshToken(): Promise<void> {
    if (isWeb) return;
    await SecureStore.deleteItemAsync('refresh_token');
  },

  async hasRefreshToken(): Promise<boolean> {
    if (isWeb) return false;
    const value = await SecureStore.getItemAsync('refresh_token');
    return value !== null && value !== '';
  },

  async saveTokens(access: string, refresh: string): Promise<void> {
    if (isWeb) {
      _accessToken = access;
    } else {
      await Promise.all([
        SecureStore.setItemAsync('access_token', access),
        SecureStore.setItemAsync('refresh_token', refresh),
      ]);
    }
  },

  async removeTokens(): Promise<void> {
    if (isWeb) {
      _accessToken = null;
    } else {
      await Promise.all([
        SecureStore.deleteItemAsync('access_token'),
        SecureStore.deleteItemAsync('refresh_token'),
      ]);
    }
  },
};

export default tokenService;
