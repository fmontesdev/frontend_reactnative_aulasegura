import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useUnreadNotificationCount } from '../../../hooks/queries/useNotifications';

export default function NotificationsIndex() {
  const router = useRouter();
  const { data: unreadCountData, isLoading } = useUnreadNotificationCount();

  useEffect(() => {
    if (!isLoading) {
      router.replace((unreadCountData?.count ?? 0) > 0 ? '/notifications/unread' : '/notifications/all');
    }
  }, [isLoading, router, unreadCountData?.count]);

  return <ActivityIndicator />;
}
