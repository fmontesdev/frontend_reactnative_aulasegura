import {
  CreateEventPermissionData,
  CreateWeeklyPermissionData,
  DeletePermissionParams,
  DeletePermissionResponse,
  PermissionResponse,
  UpdateWeeklyPermissionParams,
} from '../types/Permission';
import apiService from './apiService';

export const permissionService = {
  async getAllPermissions(): Promise<PermissionResponse[]> {
    return apiService.get<PermissionResponse[]>('/permissions');
  },

  async createEventPermission(data: CreateEventPermissionData): Promise<PermissionResponse> {
    return apiService.post<PermissionResponse>('/permissions/event-schedule', data);
  },

  async createWeeklyPermission(data: CreateWeeklyPermissionData): Promise<PermissionResponse> {
    return apiService.post<PermissionResponse>('/permissions/weekly-schedule', data);
  },

  async updateWeeklyPermission({ userId, roomId, scheduleId, data }: UpdateWeeklyPermissionParams): Promise<PermissionResponse> {
    return apiService.patch<PermissionResponse>(`/permissions/weekly-schedule/${userId}/${roomId}/${scheduleId}`, data);
  },

  async softDeletePermission({ userId, roomId, scheduleId }: DeletePermissionParams): Promise<DeletePermissionResponse> {
    return apiService.delete<DeletePermissionResponse>(`/permissions/${userId}/${roomId}/${scheduleId}`);
  },
};
