/**
 * Hooks de TanStack Query para gestión de usuarios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { UpdateUserData, CreateUserData, UsersFilters } from '../../types/User';
import { departmentKeys } from './useDepartments';

// Keys para el caché de React Query
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (userId: string) => [...userKeys.details(), userId] as const,
};

// Hook para obtener todos los usuarios con filtros opcionales
export function useUsers(filters?: UsersFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userService.getAllUsers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

// Hook para obtener un usuario específico por ID
export function useUser(userId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => userService.getUserById(userId!),
    enabled: !!userId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos (detalles cambian menos frecuentemente)
  });
}

// Hook para crear un usuario
// Invalida automáticamente el caché de usuarios tras la creación
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      // Invalida todas las queries de listas de usuarios para refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Invalida también departamentos por si el nuevo usuario tiene departamento
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

// Hook para actualizar un usuario
// Invalida automáticamente el caché de usuarios tras la actualización
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
      userService.updateUser(userId, data),
    onSuccess: (updatedUser) => {
      // Actualiza el usuario en el caché de detalle
      queryClient.setQueryData(userKeys.detail(updatedUser.userId), updatedUser);

      // Invalida todas las queries de listas de usuarios para refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Invalida también departamentos por si cambió el departamento del usuario
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

// Hook para eliminar un usuario
// Invalida automáticamente el caché de usuarios tras la eliminación
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (_, deletedUserId) => {
      // Elimina el usuario del caché de detalle
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedUserId) });

      // Invalida todas las queries de listas de usuarios para refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Invalida también departamentos por si se eliminó un profesor
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

// Hook para subir avatar de un usuario
// Actualiza automáticamente el caché de usuarios tras subir el avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      userService.uploadAvatar(userId, file),
    onSuccess: (updatedUser) => {
      // Actualiza el usuario en el caché de detalle
      queryClient.setQueryData(userKeys.detail(updatedUser.userId), updatedUser);

      // Invalida todas las queries de listas de usuarios para refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
