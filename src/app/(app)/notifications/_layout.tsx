import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { usePathname, useRouter } from 'expo-router';
import Tabs from '../../../components/Tabs';
import { useMarkAllNotificationsAsRead, useUnreadNotificationCount } from '../../../hooks/queries/useNotifications';
import { useAppTheme } from '../../../theme';
import { TabConfig } from '../../../types/Tab';

export default function NotificationsLayout() {
  const theme = useAppTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { data: unreadCountData, isLoading: isUnreadCountLoading } = useUnreadNotificationCount();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const unreadCount = unreadCountData?.count ?? 0;
  const shouldShowUnreadTab = isUnreadCountLoading || unreadCount > 0;
  const tabs: TabConfig[] = [
    ...(shouldShowUnreadTab ? [{ name: 'unread', title: 'No leídas', icon: 'bell-alert' as const, route: '/notifications/unread', badge: unreadCount > 0 ? unreadCount : undefined }] : []),
    { name: 'all', title: 'Todas', icon: 'bell' as const, route: '/notifications/all' },
    { name: 'send', title: 'Enviar', icon: 'send' as const, route: '/notifications/send' },
  ];

  useEffect(() => {
    if (!isUnreadCountLoading && !shouldShowUnreadTab && pathname === '/notifications/unread') {
      router.replace('/notifications/all');
    }
  }, [isUnreadCountLoading, pathname, router, shouldShowUnreadTab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {unreadCount > 0 ? (
          <View style={styles.actionsRow}>
          <Button
            mode="contained"
            icon="check-all"
            compact
            onPress={() => markAllAsRead.mutate()}
            loading={markAllAsRead.isPending}
            disabled={markAllAsRead.isPending}
            style={[styles.markAllButton, { backgroundColor: theme.colors.success }]}
            contentStyle={styles.markAllButtonContent}
            labelStyle={styles.markAllButtonLabel}
            textColor={theme.colors.onSuccess}
          >
            Marcar como leídas
          </Button>
          </View>
        ) : null}

        <Tabs tabs={tabs} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsWrapper: {
    flex: 1,
    position: 'relative',
  },
  actionsRow: {
    position: 'absolute',
    top: 9,
    right: 16,
    zIndex: 10,
  },
  markAllButton: {
    borderRadius: 18,
  },
  markAllButtonContent: {
    minHeight: 28,
    paddingHorizontal: 6,
  },
  markAllButtonLabel: {
    marginVertical: 2,
    marginHorizontal: 6,
    fontSize: 12,
  },
});
