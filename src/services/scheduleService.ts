import { CreateWeeklyScheduleData, DeleteScheduleResponse, ScheduleResponse, UpdateWeeklyScheduleData } from '../types/Schedule';
import apiService from './apiService';

export const scheduleService = {
  async getAllSchedules(): Promise<ScheduleResponse[]> {
    return apiService.get<ScheduleResponse[]>('/schedules');
  },

  async getScheduleById(scheduleId: number): Promise<ScheduleResponse> {
    return apiService.get<ScheduleResponse>(`/schedules/${scheduleId}`);
  },

  async createWeeklySchedule(data: CreateWeeklyScheduleData): Promise<ScheduleResponse> {
    return apiService.post<ScheduleResponse>('/weekly-schedules', data);
  },

  async updateWeeklySchedule(scheduleId: number, data: UpdateWeeklyScheduleData): Promise<ScheduleResponse> {
    return apiService.patch<ScheduleResponse>(`/weekly-schedules/${scheduleId}`, data);
  },

  async softDeleteSchedule(scheduleId: number): Promise<DeleteScheduleResponse> {
    return apiService.delete<DeleteScheduleResponse>(`/schedules/${scheduleId}`);
  },
};
