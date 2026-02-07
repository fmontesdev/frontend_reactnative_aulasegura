import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { Slot } from 'expo-router';
import { useAppTheme } from '../../theme';
import { FilterProvider } from '../../contexts/FilterContext';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function AppLayout() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Colapsar automáticamente el sidebar en pantallas menores a 1280px
  useEffect(() => {
    if (width < 1280) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [width]);

  return (
    <FilterProvider>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Topbar */}
          <Topbar sidebarCollapsed={sidebarCollapsed} />

          {/* Content - Aquí se renderizan las rutas hijas */}
          <ScrollView
            style={[
              styles.contentArea,
              {
                marginLeft: Platform.OS === 'web' ? (sidebarCollapsed ? 64 : 250) : 0,
                marginTop: Platform.OS === 'web' ? 64 : 0,
              },
            ]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Slot />
          </ScrollView>
        </View>
      </View>
    </FilterProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
});
