import { AccessLogsFilters, PaginatedAccessLogs } from '../types/AccessLog';
import apiService from './apiService';

export const accessLogService = {
  async getAllAccessLogs(filters?: AccessLogsFilters): Promise<PaginatedAccessLogs> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    if (filters?.filters && filters.filters.length > 0) {
      params.append('filters', filters.filters.join(','));
    }

    const queryString = params.toString();
    const url = queryString ? `/access/logs?${queryString}` : '/access/logs';

    return apiService.get<PaginatedAccessLogs>(url);
  },
};
