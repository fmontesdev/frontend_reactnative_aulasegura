import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { permissionService } from '../../services/permissionService';
import { CreateEventPermissionData, CreateWeeklyPermissionData, DeletePermissionParams, UpdateWeeklyPermissionParams } from '../../types/Permission';
import { scheduleKeys } from './useSchedules';

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: () => [...permissionKeys.lists()] as const,
};

export function usePermissions() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: permissionService.getAllPermissions,
    staleTime: 1000 * 60,
  });
}

export function useCreateEventPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventPermissionData) => permissionService.createEventPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useCreateWeeklyPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWeeklyPermissionData) => permissionService.createWeeklyPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useUpdateWeeklyPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateWeeklyPermissionParams) => permissionService.updateWeeklyPermission(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useSoftDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeletePermissionParams) => permissionService.softDeletePermission(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}
