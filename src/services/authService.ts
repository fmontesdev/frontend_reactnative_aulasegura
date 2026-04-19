/**
 * Service de autenticación
 */

import apiService from './apiService';
import tokenService from './tokenService';
import { User, RoleName } from '../types/User';
import { AuthResponse, LoginRequest, ChangePasswordRequest } from '../types/Auth';

export const authService = {
  // Inicia sesión con email y contraseña
  async login(login: LoginRequest): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const response = await apiService.post<AuthResponse>('/auth/login', {
      email: login.email,
      password: login.password,
    });

    // Extraer el user antes de persistir para verificar el rol
    const { accessToken, refreshToken, ...userData } = response;

    // Verificar rol admin ANTES de guardar tokens en storage.
    // Si se guardaran primero y el logout fallase, quedarían tokens de un
    // usuario no-admin persistidos en disco.
    if (!userData.roles?.includes(RoleName.ADMIN)) {
      throw new Error('Acceso denegado.\nSolo los administradores pueden acceder al panel');
    }

    // Solo si el rol es válido, persistir los tokens
    await tokenService.saveTokens(accessToken, refreshToken);

    return { user: userData, accessToken, refreshToken };
  },

  // Refresca el access token usando el refresh token
  async refreshToken(refreshToken: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const response = await apiService.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    // Guarda los nuevos tokens
    await tokenService.saveTokens(response.accessToken, response.refreshToken);

    // Extrae el user de la respuesta
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, ...userData } = response;
    
    return { user: userData, accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  // Logout del usuario. Invalida el refresh token en el backend y limpia el storage local
  async logout(): Promise<void> {
    try {
      const refreshToken = await tokenService.getRefreshToken();
      
      if (refreshToken) {
        // Intenta invalidar el token en el backend
        await apiService.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Continúa con el logout local aunque falle el backend
    } finally {
      // Siempre limpia los tokens locales
      await tokenService.removeTokens();
    }
  },

  // Obtiene los datos del usuario autenticado actual
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response;
  },

  // Cambia la contraseña del usuario
  async changePassword(changePassword: ChangePasswordRequest): Promise<void> {
    await apiService.post<void>('/auth/change-password', {
      oldPassword: changePassword.oldPassword,
      newPassword: changePassword.newPassword,
    });
  },

  // Verifica si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    return tokenService.hasAccessToken();
  },
};
