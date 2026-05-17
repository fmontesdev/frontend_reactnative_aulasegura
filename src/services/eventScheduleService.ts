import { EventScheduleResponse, UpdateEventScheduleData } from '../types/Schedule';
import apiService from './apiService';

export const eventScheduleService = {
  async getAllEventSchedules(): Promise<EventScheduleResponse[]> {
    return apiService.get<EventScheduleResponse[]>('/event-schedules');
  },

  async updateEventSchedule(scheduleId: number, data: UpdateEventScheduleData): Promise<EventScheduleResponse> {
    return apiService.patch<EventScheduleResponse>(`/event-schedules/${scheduleId}`, data);
  },
};
