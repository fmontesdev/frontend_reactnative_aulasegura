/**
 * Tipos relacionados con los datos de ejemplo (dummies) para el dashboard
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Reservation {
  id: number;
  classroom: string;
  user: string;
  time: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface KPIData {
  title: string;
  value: number | string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  badge?: string;
  route: string;
}

export interface QuickAction {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
  color: string;
}
