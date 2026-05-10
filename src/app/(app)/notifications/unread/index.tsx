import React from 'react';
import { NotificationsList } from '../../../../components/Notifications/NotificationsList';

export default function UnreadNotificationsScreen() {
  return <NotificationsList read={false} emptyMessage="No hay notificaciones sin leer" />;
}
