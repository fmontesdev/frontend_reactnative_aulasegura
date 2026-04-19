/**
 * Service de autenticación
 */

import apiService from './apiService';
import tokenService from './tokenService';
import { User, RoleName } from '../types/User';
import { AuthResponse, LoginRequest, ChangePasswordRequest } from '../types/Auth';
import { logger } from '../utils/logger';

export const authService = {
  // Inicia sesión con email y contraseña
  async login(login: LoginRequest): Promise<{ user: User; accessToken: string }> {
    const response = await apiService.post<AuthResponse>('/auth/login', {
      email: login.email,
      password: login.password,
    });

    // Extrae el user antes de persistir para verificar el rol
    const { accessToken, ...userData } = response;

    // Verifica el rol admin ANTES de guardar el accessToken para evitar persistir tokens de usuarios no autorizados
    if (!userData.roles?.includes(RoleName.ADMIN)) {
      throw new Error('Acceso denegado.\nSolo los administradores pueden acceder al panel');
    }

    // Solo si el rol es válido, persistir el accessToken
    await tokenService.saveAccessToken(accessToken);

    return { user: userData, accessToken };
  },

  // Refresca el access token usando la cookie refreshToken
  async refreshToken(): Promise<{ user: User; accessToken: string }> {
    const response = await apiService.post<AuthResponse>('/auth/refresh');

    // Guarda el nuevo accessToken
    await tokenService.saveAccessToken(response.accessToken);

    // Extrae el user  de la respuesta para devolverlo junto al nuevo accessToken
    const { accessToken, ...userData } = response;
    return { user: userData, accessToken };
  },

  // Cierra la sesión del usuario usando la cookie refreshToken y limpia el accessToken local
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      logger.error('Error during logout:', error);
    } finally {
      // Siempre limpia el accessToken local
      await tokenService.removeAccessToken();
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
