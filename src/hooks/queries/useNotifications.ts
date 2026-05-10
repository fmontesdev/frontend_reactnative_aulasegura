import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { NotificationListFilters, UnreadNotificationCount } from '../../types/Notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationListFilters) => [...notificationKeys.lists(), filters] as const,
  infiniteList: (filters?: Omit<NotificationListFilters, 'page'>) => [
    ...notificationKeys.lists(),
    'infinite',
    filters,
  ] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

export function useNotifications(filters?: NotificationListFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationService.getNotifications(filters),
    staleTime: 1000 * 30,
  });
}

export function useInfiniteNotifications(filters?: Omit<NotificationListFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: notificationKeys.infiniteList(filters),
    queryFn: ({ pageParam }) => notificationService.getNotifications({
      ...filters,
      page: pageParam,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
    staleTime: 1000 * 30,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationService.getUnreadCount,
    staleTime: 1000 * 15,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousUnreadCount = queryClient.getQueryData<UnreadNotificationCount>(notificationKeys.unreadCount());

      queryClient.setQueryData<UnreadNotificationCount>(notificationKeys.unreadCount(), (current) => ({
        count: Math.max((current?.count ?? 1) - 1, 0),
      }));

      return { previousUnreadCount };
    },
    onError: (_error, _notificationId, context) => {
      queryClient.setQueryData(notificationKeys.unreadCount(), context?.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousUnreadCount = queryClient.getQueryData<UnreadNotificationCount>(notificationKeys.unreadCount());

      queryClient.setQueryData<UnreadNotificationCount>(notificationKeys.unreadCount(), { count: 0 });

      return { previousUnreadCount };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(notificationKeys.unreadCount(), context?.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
