import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Menu, Badge, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../theme';
import { addOpacity } from '../../utils/colorUtils';
import { NotificationItem } from './components/NotificationItem';
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications, useUnreadNotificationCount } from '../../hooks/queries/useNotifications';

// Menú de notificaciones del Topbar
export function NotificationMenu() {
  const theme = useAppTheme();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [isHoveredIcon, setIsHoveredIcon] = useState(false);
  const [isHoveredButton, setIsHoveredButton] = useState(false);
  const [isHoveredMarkRead, setIsHoveredMarkRead] = useState(false);
  const { data: notificationsPage, isLoading } = useNotifications({ page: 1, limit: 5, read: false });
  const { data: unreadCountData } = useUnreadNotificationCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const visibleNotifications = notificationsPage?.data ?? [];
  const unreadCount = unreadCountData?.count ?? visibleNotifications.filter((notification) => notification.readAt === null).length;

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable
            onPress={() => setVisible(true)}
            onHoverIn={() => setIsHoveredIcon(true)}
            onHoverOut={() => setIsHoveredIcon(false)}
            style={[
              styles.iconButton,
              {
                backgroundColor: isHoveredIcon ? addOpacity(theme.colors.secondary, 0.1) : 'transparent',
                borderRadius: 25,
                // @ts-ignore
                transitionDuration: '200ms',
              },
            ]}
          >
            <MaterialCommunityIcons name="bell" size={24} color={theme.colors.grey} />
            {unreadCount > 0 && (
              <Badge style={styles.badge} size={18}>
                {unreadCount}
              </Badge>
            )}
          </Pressable>
        }
        contentStyle={[styles.menu, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.notificationsContainer}>
          <View style={[styles.titleContainer, { borderBottomColor: theme.colors.outlineVariant }]}> 
            <Text variant="titleMedium" style={[styles.title, { color: theme.colors.secondary }]}> 
              No leídas
            </Text>
            {unreadCount > 0 ? (
              <Pressable
                onPress={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                onHoverIn={() => setIsHoveredMarkRead(true)}
                onHoverOut={() => setIsHoveredMarkRead(false)}
                style={[
                  styles.markReadAction,
                  {
                    backgroundColor: isHoveredMarkRead ? addOpacity(theme.colors.success, 0.08) : 'transparent',
                    // @ts-ignore
                    transitionDuration: '200ms',
                  },
                ]}
              >
                <MaterialCommunityIcons name="check-all" size={15} color={theme.colors.success} />
                <Text variant="labelSmall" style={{ color: theme.colors.success }}>
                  Marcar leídas
                </Text>
              </Pressable>
            ) : null}
          </View>
          {isLoading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : visibleNotifications.length > 0 ? (
            visibleNotifications.map(notification => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                showUnreadIcon={false}
                onPress={() => {
                  if (notification.readAt === null) {
                    markAsRead.mutate(notification.notificationId);
                  }
                }}
              />
            ))
          ) : (
            <View style={styles.stateContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                No hay notificaciones
              </Text>
            </View>
          )}
          <View style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}> 
            <Pressable
              onPress={() => {
                setVisible(false);
                router.push('/notifications');
              }}
              onHoverIn={() => setIsHoveredButton(true)}
              onHoverOut={() => setIsHoveredButton(false)}
              style={[styles.viewAllButton, {
                backgroundColor: isHoveredButton ? addOpacity(theme.colors.secondary, 0.08) : 'transparent',
                // @ts-ignore
                transitionDuration: '200ms',
              }]}
            >
              <View style={styles.viewAllTextContainer}>
                <MaterialCommunityIcons name="bell-outline" size={16} color={theme.colors.secondary} />
                <Text variant="labelLarge" style={{ color: theme.colors.secondary }}>
                  Ver todas las notificaciones
                </Text>
              </View>
              <MaterialCommunityIcons name="arrow-right" size={18} color={theme.colors.secondary} />
            </Pressable>
          </View>
        </View>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  menu: {
    marginTop: 64,
    marginVertical: 0,
    paddingVertical: 0,
    minWidth: 360,
    maxWidth: 420,
    borderRadius: 20,
    overflow: 'hidden',
  },
  notificationsContainer: {},
  titleContainer: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  title: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewAllTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    borderTopWidth: 1,
  },
  markReadAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
