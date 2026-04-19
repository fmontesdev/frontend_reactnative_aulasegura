import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../theme';
import { KPICard } from '../../components/KPICard';
import { StyledCard } from '../../components/StyledCard';
import { QuickActionButton } from '../../components/QuickActionButton';
import { WidgetCard } from '../../components/WidgetCard';
import { ReservationItem } from '../../components/ReservationItem';
import { DeniedAccessItem } from '../../components/DeniedAccessItem';
import { useActiveUsersCount } from '../../hooks/queries/useUsers';
import { 
  kpiData as mockKpiData, 
  recentReservations as mockRecentReservations, 
  deniedAccess as mockDeniedAccess, 
  quickActions as mockQuickActions 
} from '../../data/dummies';

export default function HomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: activeUsersCount } = useActiveUsersCount();

  // Datos dummy para KPIs, reservas, accesos denegados y acciones rápidas
  const kpiData = mockKpiData(theme);
  // Reemplaza el valor dummy de usuarios activos con el dato real
  const kpiDataWithRealValues = kpiData.map((kpi) =>
    kpi.title === 'Usuarios activos'
      ? { ...kpi, value: activeUsersCount ?? '...' }
      : kpi
  );
  const recentReservations = mockRecentReservations;
  const deniedAccess = mockDeniedAccess;
  const quickActions = mockQuickActions(theme);

  const isSmallScreen = width < 768;

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isSmallScreen && styles.headerSmall]}>
          <View style={isSmallScreen && styles.headerTextSmall}>
            <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
              Dashboard
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.grey, marginTop: 4 }}>
              Bienvenido al panel de administración de AulaSegura
            </Text>
          </View>
          {isSmallScreen ? (
            <IconButton
              icon="chart-line"
              mode="contained"
              iconColor={theme.colors.onTertiary}
              containerColor={theme.colors.tertiary}
              onPress={() => router.push('/supervision/analytics')}
            />
          ) : (
            <Button
              mode="contained"
              icon="chart-line"
              onPress={() => router.push('/supervision/analytics')}
              style={{ backgroundColor: theme.colors.tertiary }}
            >
              Ver Analíticas
            </Button>
          )}
        </View>

        {/* KPIs */}
        <View style={styles.kpiContainer}>
          {kpiDataWithRealValues.map((kpi) => (
            <KPICard
              key={kpi.route}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color}
              badge={kpi.badge}
              onPress={() => router.push(kpi.route)}
            />
          ))}
        </View>

        {/* Widgets */}
        <View style={styles.widgetsContainer}>
          {/* Reservas de hoy */}
          <WidgetCard
            title="Reservas de hoy"
            actionLabel="Ver todas"
            onActionPress={() => router.push('/access/reservations')}
            style={styles.widgetCard}
          >
            {recentReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                classroom={reservation.classroom}
                user={reservation.user}
                time={reservation.time}
                status={reservation.status}
              />
            ))}
          </WidgetCard>

          {/* Accesos denegados */}
          <WidgetCard
            title="Últimos accesos denegados"
            actionLabel="Ver logs"
            onActionPress={() => router.push('/supervision/logs')}
            style={styles.widgetCard}
          >
            {deniedAccess.map((access) => (
              <DeniedAccessItem
                key={access.id}
                user={access.user}
                classroom={access.classroom}
                time={access.time}
                reason={access.reason}
              />
            ))}
          </WidgetCard>
        </View>

        {/* Acciones rápidas */}
        <StyledCard>
          <StyledCard.Content>
            <Text variant="titleLarge" style={[{ marginBottom: 16, color: theme.colors.secondary }]}>
              Acciones rápidas
            </Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <QuickActionButton
                  key={action.route}
                  title={action.title}
                  icon={action.icon}
                  color={action.color}
                  onPress={() => router.push(action.route)}
                />
              ))}
            </View>
          </StyledCard.Content>
        </StyledCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerSmall: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerTextSmall: {
    width: '100%',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  widgetCard: {
    flex: 1,
    minWidth: 300,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
});
