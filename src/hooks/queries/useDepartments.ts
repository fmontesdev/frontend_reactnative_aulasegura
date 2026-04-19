/**
 * Hooks de TanStack Query para gestión de departamentos
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { departmentService } from '../../services/departmentService';
import {
  GetDepartmentsParams,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../../types/Department';

// Keys para el caché de React Query
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: GetDepartmentsParams) => [...departmentKeys.lists(), filters] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...departmentKeys.details(), id] as const,
};

// Hook para obtener todos los departamentos (sin paginación)
export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: () => departmentService.getAllDepartments(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

// Hook para obtener departamentos con filtros y paginación
export function useFilteredDepartments(params: GetDepartmentsParams) {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: () => departmentService.getAllDepartmentsWithFilters(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    placeholderData: keepPreviousData,
  });
}

// Hook para obtener un departamento por ID
export function useDepartmentById(departmentId: number) {
  return useQuery({
    queryKey: departmentKeys.detail(departmentId),
    queryFn: () => departmentService.getDepartmentById(departmentId),
    enabled: !!departmentId,
  });
}

// Hook para crear un departamento
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentDto) => departmentService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

// Hook para actualizar un departamento
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, data }: { departmentId: number; data: UpdateDepartmentDto }) =>
      departmentService.updateDepartment(departmentId, data),
    onSuccess: (updatedDepartment) => {
      // Actualiza el detalle inmediatamente desde la respuesta (sin re-fetch)
      queryClient.setQueryData(departmentKeys.detail(updatedDepartment.departmentId), updatedDepartment);
      // Invalida la lista para que refleje el cambio
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

// Hook para eliminar un departamento
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: number) => departmentService.deleteDepartment(departmentId),
    onSuccess: (_, deletedId) => {
      // Elimina el detalle del caché
      queryClient.removeQueries({ queryKey: departmentKeys.detail(deletedId) });
      // Invalida la lista
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}
