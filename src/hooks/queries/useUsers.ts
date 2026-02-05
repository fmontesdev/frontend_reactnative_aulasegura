/**
 * Hooks de TanStack Query para gestión de usuarios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { User, UpdateUserData, CreateUserData } from '../../types/User';

// Keys para el caché de React Query
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (userId: string) => [...userKeys.details(), userId] as const,
};

// Hook para obtener todos los usuarios
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userService.getAllUsers(),
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
    onSuccess: (newUser) => {
      // Añade el nuevo usuario al caché de la lista
      queryClient.setQueryData<User[]>(userKeys.lists(), (oldUsers) => {
        if (!oldUsers) return [newUser];
        return [...oldUsers, newUser];
      });

      // Invalida queries relacionadas para forzar refetch si es necesario
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
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
      // Actualiza el usuario en el caché de la lista
      queryClient.setQueryData<User[]>(userKeys.lists(), (oldUsers) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user) =>
          user.userId === updatedUser.userId ? updatedUser : user
        );
      });

      // Actualiza el usuario en el caché de detalle
      queryClient.setQueryData(userKeys.detail(updatedUser.userId), updatedUser);

      // Invalida queries relacionadas para forzar refetch si es necesario
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
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
      // Elimina el usuario del caché de la lista
      queryClient.setQueryData<User[]>(userKeys.lists(), (oldUsers) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.filter((user) => user.userId !== deletedUserId);
      });

      // Elimina el usuario del caché de detalle
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedUserId) });

      // Invalida la lista para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
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
      // Actualiza el usuario en el caché de la lista
      queryClient.setQueryData<User[]>(userKeys.lists(), (oldUsers) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user) =>
          user.userId === updatedUser.userId ? updatedUser : user
        );
      });

      // Actualiza el usuario en el caché de detalle
      queryClient.setQueryData(userKeys.detail(updatedUser.userId), updatedUser);

      // Invalida queries relacionadas para forzar refetch si es necesario
      queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
