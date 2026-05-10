export type NotificationType = 'access' | 'warning' | 'info';

export interface Notification {
  notificationId: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface UnreadNotificationCount {
  count: number;
}

export interface MarkAllNotificationsAsReadResponse {
  updated: number;
}

export type NotificationTargetMode = 'user' | 'role' | 'all';

export type CreateNotificationTarget =
  | { mode: 'user'; userId: string }
  | { mode: 'role'; roleName: string }
  | { mode: 'all' };

export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  body: string;
  target: CreateNotificationTarget;
}

export interface CreateNotificationResponse {
  notificationId: string;
  createdRecipients: number;
}

export interface NotificationListFilters {
  page?: number;
  limit?: number;
  read?: boolean;
}

export type NotificationEventsConnectionStatus = 'connecting' | 'open' | 'error' | 'closed';

export interface NotificationPing {
  timestamp: string;
}
