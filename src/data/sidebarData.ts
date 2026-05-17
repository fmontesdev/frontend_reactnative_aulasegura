/**
 * Datos del menú del Sidebar
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
  badge?: number;
  children?: MenuItem[];
}

export const sidebarMenuItemsData: MenuItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: 'home',
    route: '/home',
  },
  {
    id: 'academic',
    label: 'Estructura Académica',
    icon: 'school',
    route: '/academic/courses',
    // route: '/academic/years',

  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: 'account-group',
    route: '/users',
  },
  {
    id: 'credentials',
    label: 'Credenciales',
    icon: 'card-account-details',
    route: '/credentials/physical',
  },
  {
    id: 'spaces',
    label: 'Espacios y Dispositivos',
    icon: 'floor-plan',
    route: '/spaces/classrooms',
  },
  {
    id: 'access',
    label: 'Control de Acceso',
    icon: 'shield-lock',
    route: '/access/permissions',
  },
  {
    id: 'notifications',
    label: 'Notificaciones',
    icon: 'bell',
    route: '/notifications',
  },
  {
    id: 'supervision',
    label: 'Supervisión',
    icon: 'monitor-dashboard',
    route: '/supervision/events',
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: 'cog',
    route: '/settings',
  },
];
