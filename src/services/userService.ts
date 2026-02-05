/**
 * Service para operaciones de usuarios
 */

import { User, UpdateUserData, DeleteUserResponse, CreateUserData } from '../types/User';
import apiService from './apiService';

export const userService = {
  // Obtiene todos los usuarios
  async getAllUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
  },

  // Obtiene un usuario por su ID
  async getUserById(userId: string): Promise<User> {
    return apiService.get<User>(`/users/${userId}`);
  },

  // Crea un nuevo usuario
  async createUser(data: CreateUserData): Promise<User> {
    return apiService.post<User>('/auth/register', data);
  },

  // Actualiza un usuario por su ID
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    return apiService.patch<User>(`/users/${userId}`, data);
  },

  // Elimina un usuario por su ID
  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    return apiService.delete<DeleteUserResponse>(`/users/${userId}`);
  },

  // Sube un avatar para un usuario por su ID
  async uploadAvatar(userId: string, file: File): Promise<User> {
    const formData = new FormData();
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const filename = `avatar_${userId}_${timestamp}.${fileExtension}`;
    
    formData.append('file', file);
    formData.append('filename', filename);
    
    return apiService.post<User>(`/users/${userId}/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
