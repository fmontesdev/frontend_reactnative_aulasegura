import { DepartmentBasic } from './Department';
import { Pagination } from './Pagination';
import { RoleName } from './User';

export type AccessMethod = 'rfid' | 'nfc' | 'qr';
export type AccessStatus = 'allowed' | 'denied' | 'exit' | 'timeout';

export interface AccessLogUser {
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string | null;
  roles: RoleName[];
  validFrom: string;
  validTo: string | null;
  createdAt: string;
  department: DepartmentBasic | null;
}

export interface AccessLogRoom {
  roomId: number;
  roomCode: string;
  name: string;
  courseName: string | null;
  capacity: number;
  building: number;
  floor: number;
  readers: unknown[];
}

export interface AccessLog {
  accessLogId: number;
  tagId: number | null;
  user: AccessLogUser;
  readerId: number;
  room: AccessLogRoom;
  subjectId: number | null;
  accessMethod: AccessMethod;
  accessStatus: AccessStatus;
  reasonStatus: string | null;
  createdAt: string;
}

export interface PaginatedAccessLogs {
  data: AccessLog[];
  meta: Pagination;
}

export interface AccessLogsFilters {
  page?: number;
  limit?: number;
  filters?: string[];
}

export type SseConnectionStatus = 'connecting' | 'open' | 'error' | 'closed';
