import {
  CreateNotificationData,
  CreateNotificationResponse,
  MarkAllNotificationsAsReadResponse,
  Notification,
  NotificationListFilters,
  UnreadNotificationCount,
} from '../types/Notification';
import { Pagination } from '../types/Pagination';
import apiService from './apiService';

export interface PaginatedNotificationsResponse {
  data: Notification[];
  meta: Pagination;
}

export const notificationService = {
  async getNotifications(filters?: NotificationListFilters): Promise<PaginatedNotificationsResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.read !== undefined) params.append('read', filters.read.toString());

    const queryString = params.toString();
    const url = queryString ? `/notifications?${queryString}` : '/notifications';

    return apiService.get<PaginatedNotificationsResponse>(url);
  },

  async getUnreadCount(): Promise<UnreadNotificationCount> {
    return apiService.get<UnreadNotificationCount>('/notifications/unread-count');
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    return apiService.patch<Notification>(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<MarkAllNotificationsAsReadResponse> {
    return apiService.patch<MarkAllNotificationsAsReadResponse>('/notifications/read-all');
  },

  async createNotification(data: CreateNotificationData): Promise<CreateNotificationResponse> {
    return apiService.post<CreateNotificationResponse>('/notifications', data);
  },
};
