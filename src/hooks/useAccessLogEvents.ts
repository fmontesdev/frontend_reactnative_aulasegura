import { useContext } from 'react';
import { AccessLogEventsContext } from '../contexts/AccessLogEventsContext';
import { AccessLog, SseConnectionStatus } from '../types/AccessLog';

export function useAccessLogEvents(): {
  events: AccessLog[];
  connectionStatus: SseConnectionStatus;
  error: string | null;
  clearEvents: () => void;
} {
  const context = useContext(AccessLogEventsContext);

  if (!context) {
    throw new Error('useAccessLogEvents must be used within AccessLogEventsProvider');
  }

  return context;
}
