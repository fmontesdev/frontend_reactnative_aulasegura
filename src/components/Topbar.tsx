import React, { useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { notifications as mockNotifications } from '../data/dummies';
import { GlobalSearch } from './GlobalSearch';
import { SearchMenu } from './SearchMenu';
import { AcademicYearSelector } from './AcademicYearMenu';
import { NotificationMenu } from './NotificationMenu';
import { UserProfileMenu } from './ProfileMenu';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export default function Topbar({ sidebarCollapsed }: TopbarProps) {
  const theme = useAppTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  // Breakpoints para responsive
  const isLargeScreen = width >= 768;
  const isMediumScreen = width >= 480 && width < 768;

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    // TODO: Aplicar filtros por año académico
    console.log('Año seleccionado:', year);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
          marginLeft: Platform.OS === 'web' ? (sidebarCollapsed ? 64 : 250) : 0,
        },
      ]}
    >
      {/* Búsqueda: visible solo en pantallas grandes */}
      {isLargeScreen && <GlobalSearch />}

      {/* Menú de búsqueda para pantallas pequeñas */}
      {!isLargeScreen && <SearchMenu />}

      <View style={styles.rightSection}>
        {/* Selector de año: ocultar en pantallas muy pequeñas */}
        {(isLargeScreen || isMediumScreen) && (
          <AcademicYearSelector selectedYear={selectedYear} onYearSelect={handleYearSelect} />
        )}
        <NotificationMenu notifications={mockNotifications} />
        <UserProfileMenu user={user} onLogout={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 6,
    minHeight: 64,
    ...Platform.select({
      web: {
        position: 'absolute' as 'absolute',
        right: 0,
        top: 0,
        left: 0,
        zIndex: 99,
      },
    }),
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

});
