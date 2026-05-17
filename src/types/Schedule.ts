export type ScheduleType = 'weekly' | 'event';

export type EventScheduleType = 'reservation' | 'temp_pass';

export type EventStatus = 'pending' | 'approved' | 'revoked' | 'active' | 'expired';

export interface WeeklyScheduleResponse {
  weeklyScheduleId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface EventScheduleResponse {
  eventScheduleId: number;
  eventScheduleType?: EventScheduleType;
  description: string;
  startAt: string;
  endAt: string;
  status: EventStatus;
  reservationStatusReason?: string | null;
}

export interface ScheduleResponse {
  scheduleId: number;
  type: ScheduleType;
  academicYear?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  weeklySchedule?: WeeklyScheduleResponse | null;
  eventSchedule?: EventScheduleResponse | null;
}

export interface CreateWeeklyScheduleData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateWeeklyScheduleData {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

export interface UpdateEventScheduleData {
  description?: string;
  status?: EventStatus;
  reservationStatusReason?: string;
}

export interface DeleteScheduleResponse {
  message: string;
}
