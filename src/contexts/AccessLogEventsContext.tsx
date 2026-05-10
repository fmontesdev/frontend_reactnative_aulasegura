import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { API_CONFIG } from '../constants';
import { AccessLog, SseConnectionStatus } from '../types/AccessLog';
import { logger } from '../utils/logger';

const MAX_EVENTS = 100;
const EVENT_SOURCE_UNAVAILABLE = 'Los eventos en tiempo real no están disponibles en este entorno.';
const SSE_CONNECTION_ERROR = 'No se pudo conectar con los eventos de acceso. Reintentando...';

export interface AccessLogEventsContextValue {
  events: AccessLog[];
  connectionStatus: SseConnectionStatus;
  error: string | null;
  clearEvents: () => void;
}

export const AccessLogEventsContext = createContext<AccessLogEventsContextValue | undefined>(
  undefined
);

export function AccessLogEventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AccessLog[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<SseConnectionStatus>('connecting');
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

    const eventSource = new EventSource(`${API_CONFIG.NESTJS_API_URL}/access/events`, {
      withCredentials: true,
    });

    eventSource.onopen = () => {
      setConnectionStatus('open');
      setError(null);
    };

    eventSource.onerror = (event) => {
      logger.warn('Error en la conexión SSE de access logs', event);
      setConnectionStatus('error');
      setError(SSE_CONNECTION_ERROR);
    };

    eventSource.addEventListener('access-log', (event) => {
      try {
        const accessLog = JSON.parse(event.data) as AccessLog;

        setEvents((currentEvents) => {
          const deduplicatedEvents = currentEvents.filter(
            (currentEvent) => currentEvent.accessLogId !== accessLog.accessLogId
          );

          return [accessLog, ...deduplicatedEvents].slice(0, MAX_EVENTS);
        });
      } catch (parseError) {
        logger.error('No se pudo parsear el evento access-log', parseError);
      }
    });

    return () => {
      setConnectionStatus('closed');
      eventSource.close();
    };
  }, []);

  return (
    <AccessLogEventsContext.Provider
      value={{ events, connectionStatus, error, clearEvents }}
    >
      {children}
    </AccessLogEventsContext.Provider>
  );
}
