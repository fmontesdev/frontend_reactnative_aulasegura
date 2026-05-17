import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventScheduleService } from '../../services/eventScheduleService';
import { UpdateEventScheduleData } from '../../types/Schedule';
import { permissionKeys } from './usePermissions';
import { scheduleKeys } from './useSchedules';

export const eventScheduleKeys = {
  all: ['event-schedules'] as const,
  lists: () => [...eventScheduleKeys.all, 'list'] as const,
  list: () => [...eventScheduleKeys.lists()] as const,
};

export function useEventSchedules() {
  return useQuery({
    queryKey: eventScheduleKeys.list(),
    queryFn: eventScheduleService.getAllEventSchedules,
    staleTime: 1000 * 60,
  });
}

export function useUpdateEventSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: number; data: UpdateEventScheduleData }) =>
      eventScheduleService.updateEventSchedule(scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventScheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}
