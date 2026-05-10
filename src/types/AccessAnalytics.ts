import { RoleName } from './User';

export type AccessAnalyticsDateRange = 'today' | 'week' | 'month';

export interface AccessAnalyticsKpis {
  totalAccesses: number;
  allowedAccesses: number;
  deniedAccesses: number;
  denialRate: number;
}

export interface TopDeniedRoom {
  roomId: number;
  roomCode: string;
  roomName: string;
  building: number;
  floor: number;
  deniedCount: number;
}

export interface TopDeniedUser {
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string | null;
  roles: RoleName[];
  deniedCount: number;
}

export interface HourlyActivityBucket {
  hour: number;
  total: number;
  allowed: number;
  denied: number;
  timeout: number;
  exit: number;
}

export interface AccessAnalyticsSummary {
  kpis: AccessAnalyticsKpis;
  topDeniedRooms: TopDeniedRoom[];
  topDeniedUsers: TopDeniedUser[];
  hourlyActivity: HourlyActivityBucket[];
}

export interface AccessAnalyticsSummaryFilters {
  date?: AccessAnalyticsDateRange;
  limit?: number;
}
