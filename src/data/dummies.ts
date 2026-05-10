/**
 * Datos de ejemplo para el Dashboard
 * TODO: Reemplazar con datos reales del backend
 */

import { AppTheme } from '../theme';

export const kpiData = (theme: AppTheme) => [
  {
    title: 'Reservas de hoy',
    value: 24,
    icon: 'calendar-check' as const,
    color: theme.colors.primary,
    badge: '3 pendientes',
    route: '/access/reservations',
  },
  {
    title: 'Usuarios activos',
    value: 142,
    icon: 'account-group' as const,
    color: theme.colors.success,
    route: '/users',
  },
  {
    title: 'Accesos hoy',
    value: '...',
    icon: 'door-open' as const,
    color: theme.colors.tertiary,
    route: '/supervision/logs?filters=fecha:hoy',
  },
  {
    title: 'Tasa de denegación',
    value: '...',
    icon: 'shield-alert' as const,
    color: theme.colors.error,
    route: '/supervision/logs?filters=fecha:hoy,estado:denegado',
  },
];

export const recentReservations = [
  { id: 1, classroom: 'Aula 47', user: 'Paco García', time: '15:10 - 16:05', status: 'approved' as const },
  { id: 2, classroom: 'Aula 12', user: 'María López', time: '16:05 - 17:00', status: 'pending' as const },
  { id: 3, classroom: 'Laboratorio 3', user: 'Juan Pérez', time: '17:00 - 18:00', status: 'approved' as const },
];

export const quickActions = (theme: AppTheme) => [
  { title: 'Crear Usuario', icon: 'account-plus' as const, route: '/users/create', color: theme.colors.primary },
  { title: 'Crear Credencial', icon: 'card-plus' as const, route: '/credentials/create', color: theme.colors.warning },
  { title: 'Crear Reserva', icon: 'calendar-plus' as const, route: '/access/reservations/create', color: theme.colors.tertiary },
  { title: 'Crear Permiso', icon: 'key-plus' as const, route: '/access/permissions/create', color: theme.colors.success },
];

export const academicYears = [
  '2025-2026',
  '2024-2025',
  '2023-2024',
];
