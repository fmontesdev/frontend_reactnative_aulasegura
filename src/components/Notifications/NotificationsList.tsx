import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { ErrorState } from '../ErrorState';
import { NotificationItem } from '../NotificationMenu/components/NotificationItem';
import { StyledCard } from '../StyledCard';
import { useInfiniteNotifications, useMarkNotificationAsRead } from '../../hooks/queries/useNotifications';
import { useAppTheme } from '../../theme';
import { Notification } from '../../types/Notification';

interface NotificationsListProps {
  read?: boolean;
  emptyMessage: string;
}

export function NotificationsList({ read, emptyMessage }: NotificationsListProps) {
  const theme = useAppTheme();
  const { height } = useWindowDimensions();
  const markAsRead = useMarkNotificationAsRead();
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotifications({ limit: 20, read });
  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  const listMaxHeight = height - 200;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderNotification = useCallback(({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => {
        if (item.readAt === null) {
          markAsRead.mutate(item.notificationId);
        }
      }}
    />
  ), [markAsRead]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando notificaciones...
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar notificaciones" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <StyledCard style={styles.card}>
        <FlatList
          data={notifications}
          keyExtractor={(notification) => notification.notificationId}
          renderItem={renderNotification}
          style={{ maxHeight: listMaxHeight }}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[theme.colors.secondary]}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text variant="bodyLarge" style={{ color: theme.colors.grey }}>
                {emptyMessage}
              </Text>
            </View>
          )}
          ListFooterComponent={isFetchingNextPage ? (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null}
        />
      </StyledCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 24,
    overflow: 'hidden',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadMoreContainer: {
    alignItems: 'center',
    padding: 16,
  },
});
