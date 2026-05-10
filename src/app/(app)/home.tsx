import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../theme';
import { KPICard } from '../../components/KPICard';
import { StyledCard } from '../../components/StyledCard';
import { QuickActionButton } from '../../components/QuickActionButton';
import { WidgetCard } from '../../components/WidgetCard';
import { ReservationItem } from '../../components/ReservationItem';
import { DeniedAccessItem } from '../../components/DeniedAccessItem';
import { useActiveUsersCount } from '../../hooks/queries/useUsers';
import { useAccessLogs } from '../../hooks/queries/useAccessLogs';
import { 
  kpiData as mockKpiData, 
  recentReservations as mockRecentReservations, 
  quickActions as mockQuickActions 
} from '../../data/dummies';

function formatDenialRate(totalAccesses?: number, deniedAccesses?: number) {
  if (totalAccesses === undefined || deniedAccesses === undefined) {
    return '...';
  }

  if (totalAccesses === 0) {
    return '0%';
  }

  return `${((deniedAccesses / totalAccesses) * 100).toFixed(1)}%`;
}

export default function HomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: activeUsersCount } = useActiveUsersCount();
  const { data: todayAccessResponse } = useAccessLogs({
    page: 1,
    limit: 1,
    filters: ['fecha:hoy'],
  });
  const {
    data: deniedAccessResponse,
    isLoading: isDeniedAccessLoading,
    error: deniedAccessError,
  } = useAccessLogs({
    page: 1,
    limit: 3,
    filters: ['fecha:hoy', 'estado:denegado'],
  });

  // Datos dummy para KPIs, reservas, accesos denegados y acciones rápidas
  const kpiData = mockKpiData(theme);
  const todayAccessTotal = todayAccessResponse?.meta.total;
  const deniedAccessTotal = deniedAccessResponse?.meta.total;
  // Reemplaza el valor dummy de usuarios activos con el dato real
  const kpiDataWithRealValues = kpiData.map((kpi) =>
    kpi.title === 'Usuarios activos'
      ? { ...kpi, value: activeUsersCount ?? '...' }
      : kpi.title === 'Accesos hoy'
      ? { ...kpi, value: todayAccessTotal ?? '...' }
      : kpi.title === 'Tasa de denegación'
      ? { ...kpi, value: formatDenialRate(todayAccessTotal, deniedAccessTotal) }
      : kpi
  );
  const recentReservations = mockRecentReservations;
  const deniedAccess = deniedAccessResponse?.data || [];
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
            onActionPress={() => router.push('/supervision/logs?filters=fecha:hoy,estado:denegado')}
            style={styles.widgetCard}
          >
            {isDeniedAccessLoading ? (
              <View style={styles.widgetState}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : deniedAccessError ? (
              <Text variant="bodySmall" style={[styles.widgetStateText, { color: theme.colors.error }]}> 
                No se pudieron cargar los accesos denegados.
              </Text>
            ) : deniedAccess.length > 0 ? (
              deniedAccess.map((access, index) => (
                <DeniedAccessItem
                  key={access.accessLogId}
                  accessLog={access}
                  isLast={index === deniedAccess.length - 1}
                />
              ))
            ) : (
              <Text variant="bodySmall" style={[styles.widgetStateText, { color: theme.colors.grey }]}> 
                No hay accesos denegados hoy.
              </Text>
            )}
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
  widgetState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  widgetStateText: {
    paddingVertical: 16,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
});
