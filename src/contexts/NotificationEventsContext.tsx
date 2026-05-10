import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../constants';
import { Notification, NotificationEventsConnectionStatus } from '../types/Notification';
import { logger } from '../utils/logger';
import { notificationKeys } from '../hooks/queries/useNotifications';

const MAX_EVENTS = 50;
const EVENT_SOURCE_UNAVAILABLE = 'Las notificaciones en tiempo real no están disponibles en este entorno.';
const SSE_CONNECTION_ERROR = 'No se pudo conectar con las notificaciones. Reintentando...';

interface NotificationEventsContextValue {
  events: Notification[];
  connectionStatus: NotificationEventsConnectionStatus;
  error: string | null;
  clearEvents: () => void;
}

export const NotificationEventsContext = createContext<NotificationEventsContextValue | undefined>(
  undefined
);

export function NotificationEventsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<NotificationEventsConnectionStatus>('connecting');
  const [error, setError] = useState<string | null>(null);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    if (typeof EventSource === 'undefined') {
      setConnectionStatus('error');
      setError(EVENT_SOURCE_UNAVAILABLE);
      return;
    }

    const eventSource = new EventSource(`${API_CONFIG.NESTJS_API_URL}/notifications/events`, {
      withCredentials: true,
    });

    eventSource.onopen = () => {
      setConnectionStatus('open');
      setError(null);
    };

    eventSource.onerror = (event) => {
      logger.warn('Error en la conexión SSE de notificaciones', event);
      setConnectionStatus('error');
      setError(SSE_CONNECTION_ERROR);
    };

    eventSource.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data) as Notification;

        setEvents((currentEvents) => {
          const deduplicatedEvents = currentEvents.filter(
            (currentEvent) => currentEvent.notificationId !== notification.notificationId
          );

          return [notification, ...deduplicatedEvents].slice(0, MAX_EVENTS);
        });

        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      } catch (parseError) {
        logger.error('No se pudo parsear el evento notification', parseError);
      }
    });

    eventSource.addEventListener('ping', () => {
      setConnectionStatus('open');
      setError(null);
    });

    return () => {
      setConnectionStatus('closed');
      eventSource.close();
    };
  }, [queryClient]);

  return (
    <NotificationEventsContext.Provider value={{ events, connectionStatus, error, clearEvents }}>
      {children}
    </NotificationEventsContext.Provider>
  );
}
