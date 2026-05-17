import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../../services/scheduleService';
import { CreateWeeklyScheduleData, UpdateWeeklyScheduleData } from '../../types/Schedule';

export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: () => [...scheduleKeys.lists()] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (scheduleId: number) => [...scheduleKeys.details(), scheduleId] as const,
};

export function useSchedules() {
  return useQuery({
    queryKey: scheduleKeys.list(),
    queryFn: scheduleService.getAllSchedules,
    staleTime: 1000 * 60,
  });
}

export function useSchedule(scheduleId: number) {
  return useQuery({
    queryKey: scheduleKeys.detail(scheduleId),
    queryFn: () => scheduleService.getScheduleById(scheduleId),
    staleTime: 1000 * 60 * 5,
    enabled: Number.isFinite(scheduleId),
  });
}

export function useWeeklySchedules() {
  return useSchedules();
}

export function useCreateWeeklySchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWeeklyScheduleData) => scheduleService.createWeeklySchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useUpdateWeeklySchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: number; data: UpdateWeeklyScheduleData }) =>
      scheduleService.updateWeeklySchedule(scheduleId, data),
    onSuccess: (_, { scheduleId }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(scheduleId) });
      queryClient.invalidateQueries({ queryKey: ['permissions', 'list'] });
    },
  });
}

export function useSoftDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) => scheduleService.softDeleteSchedule(scheduleId),
    onSuccess: (_, scheduleId) => {
      queryClient.removeQueries({ queryKey: scheduleKeys.detail(scheduleId) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['permissions', 'list'] });
    },
  });
}
