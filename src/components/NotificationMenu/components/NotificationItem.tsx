import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme';
import { Notification } from '../../../types/Notification';
import { addOpacity } from '../../../utils/colorUtils';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  showUnreadIcon?: boolean;
}

// Item de notificación
export function NotificationItem({ notification, onPress, showUnreadIcon = true }: NotificationItemProps) {
  const theme = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);

  const isUnread = notification.readAt === null;
  const createdAt = new Date(notification.createdAt);
  const formattedTime = Number.isNaN(createdAt.getTime())
    ? ''
    : createdAt.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const iconName = notification.type === 'access'
    ? 'shield-alert'
    : notification.type === 'warning'
      ? 'alert'
      : 'information';
  const typeIconColor = notification.type === 'access'
    ? theme.colors.error
    : notification.type === 'warning'
      ? theme.colors.warning
      : theme.colors.tertiary;
  const hoverBackgroundColor = addOpacity(theme.colors.secondary, 0.1);
  const iconColor = isUnread ? typeIconColor : addOpacity(theme.colors.onSurface, 0.35);
  const iconBackgroundColor = addOpacity(isUnread ? typeIconColor : theme.colors.grey, 0.12);
  const primaryTextColor = isUnread ? theme.colors.onSurface : theme.colors.grey;
  const secondaryTextColor = isUnread ? theme.colors.onSurface : theme.colors.grey;

  return (
    <Pressable
      style={[
        styles.container,
        isHovered && { backgroundColor: hoverBackgroundColor },
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}> 
          <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text variant="bodyMedium" numberOfLines={1} style={[styles.title, { color: primaryTextColor }]}> 
              {notification.title}
            </Text>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons name="clock-outline" size={13} color={theme.colors.grey} />
              <Text variant="bodySmall" numberOfLines={1} style={[styles.date, { color: theme.colors.grey }]}> 
                {formattedTime}
              </Text>
            </View>
          </View>
          <Text variant="bodySmall" numberOfLines={2} style={{ color: secondaryTextColor }}>
            {notification.body}
          </Text>
        </View>
        {isUnread && showUnreadIcon ? (
          <MaterialCommunityIcons
            name="email-mark-as-unread"
            size={22}
            color={theme.colors.tertiary}
            style={styles.unreadIcon}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    gap: 12,
  },
  title: {
    flexShrink: 1,
    fontWeight: '700',
  },
  date: {
    flexShrink: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
  },
  unreadIcon: {
    marginLeft: 8,
  },
});
