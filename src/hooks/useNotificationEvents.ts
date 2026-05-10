import { useContext } from 'react';
import { NotificationEventsContext } from '../contexts/NotificationEventsContext';

export function useNotificationEvents() {
  const context = useContext(NotificationEventsContext);

  if (context === undefined) {
    throw new Error('useNotificationEvents must be used within a NotificationEventsProvider');
  }

  return context;
}
