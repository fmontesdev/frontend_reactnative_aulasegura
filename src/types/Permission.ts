import { Room } from './Room';
import { ScheduleResponse } from './Schedule';
import { TeacherAssignment } from './TeacherAssignment';
import { User } from './User';

export interface PermissionResponse {
  userId: string;
  roomId: number;
  scheduleId: number;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
  user?: User | null;
  room?: Room | null;
  schedule: ScheduleResponse;
  assignment?: TeacherAssignment | null;
}

export interface CreateEventPermissionData {
  roomId: number;
  description: string;
  startAt: string;
  endAt: string;
}

export interface CreateWeeklyPermissionData {
  userId: string;
  roomId: number;
  scheduleId: number;
  assignmentId?: number;
}

export interface UpdateWeeklyPermissionData {
  newUserId?: string;
  newRoomId?: number;
  newScheduleId?: number;
  newAssignmentId?: number | null;
}

export interface UpdateWeeklyPermissionParams extends DeletePermissionParams {
  data: UpdateWeeklyPermissionData;
}

export interface DeletePermissionParams {
  userId: string;
  roomId: number;
  scheduleId: number;
}

export interface DeletePermissionResponse {
  message: string;
}
