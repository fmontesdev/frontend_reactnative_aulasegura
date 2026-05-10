import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { accessAnalyticsService } from '../../services/accessAnalyticsService';
import { AccessAnalyticsSummaryFilters } from '../../types/AccessAnalytics';

export const accessAnalyticsKeys = {
  all: ['access-analytics'] as const,
  summaries: () => [...accessAnalyticsKeys.all, 'summary'] as const,
  summary: (filters?: AccessAnalyticsSummaryFilters) => [
    ...accessAnalyticsKeys.summaries(),
    filters,
  ] as const,
};

export function useAccessAnalyticsSummary(filters?: AccessAnalyticsSummaryFilters) {
  return useQuery({
    queryKey: accessAnalyticsKeys.summary(filters),
    queryFn: () => accessAnalyticsService.getSummary(filters),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });
}
