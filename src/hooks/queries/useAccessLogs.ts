import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { accessLogService } from '../../services/accessLogService';
import { AccessLogsFilters } from '../../types/AccessLog';

export const accessLogKeys = {
  all: ['access-logs'] as const,
  lists: () => [...accessLogKeys.all, 'list'] as const,
  list: (filters?: AccessLogsFilters) => [...accessLogKeys.lists(), filters] as const,
};

export function useAccessLogs(filters?: AccessLogsFilters) {
  return useQuery({
    queryKey: accessLogKeys.list(filters),
    queryFn: () => accessLogService.getAllAccessLogs(filters),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });
}
