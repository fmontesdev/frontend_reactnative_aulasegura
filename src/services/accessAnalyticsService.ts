import { AccessAnalyticsSummary, AccessAnalyticsSummaryFilters } from '../types/AccessAnalytics';
import apiService from './apiService';

export const accessAnalyticsService = {
  async getSummary(filters?: AccessAnalyticsSummaryFilters): Promise<AccessAnalyticsSummary> {
    const params = new URLSearchParams();

    if (filters?.date) params.append('date', filters.date);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/access/analytics/summary?${queryString}`
      : '/access/analytics/summary';

    return apiService.get<AccessAnalyticsSummary>(url);
  },
};
