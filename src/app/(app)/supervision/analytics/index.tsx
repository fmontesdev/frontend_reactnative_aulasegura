import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Avatar, SegmentedButtons, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KPICard } from '../../../../components/KPICard';
import { StyledCard } from '../../../../components/StyledCard';
import { StyledChip } from '../../../../components/StyledChip';
import { ErrorState } from '../../../../components/ErrorState';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { useAccessAnalyticsSummary } from '../../../../hooks/queries/useAccessAnalytics';
import { useAppTheme } from '../../../../theme';
import { AccessAnalyticsDateRange, HourlyActivityBucket, TopDeniedRoom, TopDeniedUser } from '../../../../types/AccessAnalytics';
import { getRoleColor, getRoleLabel } from '../../../../utils/roleUtils';
import apiService from '../../../../services/apiService';
import { styles } from './analytics.styles';

const RANGE_FILTERS: Record<AccessAnalyticsDateRange, string> = {
  today: 'fecha:hoy',
  week: 'fecha:semana',
  month: 'fecha:mes',
};

const RANGE_LABELS: Record<AccessAnalyticsDateRange, string> = {
  today: 'Hoy',
  week: 'Semana',
  month: 'Mes',
};

function getInitials(name: string, lastname: string) {
  const firstInitial = name.trim().charAt(0);
  const lastInitial = lastname.trim().charAt(0);
  return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function getFilteredLogsRoute(range: AccessAnalyticsDateRange, status?: string) {
  const filters = status ? `${RANGE_FILTERS[range]},estado:${status}` : RANGE_FILTERS[range];
  return `/supervision/logs?filters=${filters}`;
}

function HourlyActivityChart({ data }: { data: HourlyActivityBucket[] }) {
  const theme = useAppTheme();
  const maxTotal = Math.max(...data.map((bucket) => bucket.total), 0);

  return (
    <View style={styles.chartContainer}>
      {data.map((bucket) => {
        const height = maxTotal > 0 ? Math.max((bucket.total / maxTotal) * 180, 4) : 2;
        const showLabel = bucket.hour % 3 === 0 || bucket.hour === 23;
        const other = Math.max(bucket.total - bucket.allowed - bucket.denied - bucket.timeout - bucket.exit, 0);
        const allowedHeight = bucket.total > 0 ? (bucket.allowed / bucket.total) * height : 0;
        const deniedHeight = bucket.total > 0 ? (bucket.denied / bucket.total) * height : 0;
        const timeoutHeight = bucket.total > 0 ? (bucket.timeout / bucket.total) * height : 0;
        const exitHeight = bucket.total > 0 ? (bucket.exit / bucket.total) * height : 0;
        const otherHeight = bucket.total > 0 ? (other / bucket.total) * height : 0;
        const hasTopSegment = other > 0 || bucket.exit > 0 || bucket.timeout > 0;

        return (
          <View key={bucket.hour} style={styles.chartBarWrapper}>
            <View style={styles.chartBarSlot}>
              <TooltipWrapper
                title={`Total: ${bucket.total}\nPermitidos: ${bucket.allowed}\nDenegados: ${bucket.denied}\nTimeout: ${bucket.timeout}\nSalidas: ${bucket.exit}`}
                multiline
                placement="top"
                style={[styles.chartTooltipTarget, { height }]}
              >
                <View style={[styles.chartBar, { height }]}> 
                  {other > 0 ? (
                    <View style={[styles.chartSegment, styles.chartSegmentTop, { height: otherHeight, backgroundColor: theme.colors.lightGrey }]} />
                  ) : null}
                  {bucket.exit > 0 ? (
                    <View style={[styles.chartSegment, other === 0 && styles.chartSegmentTop, { height: exitHeight, backgroundColor: theme.colors.grey }]} />
                  ) : null}
                  {bucket.timeout > 0 ? (
                    <View style={[styles.chartSegment, !hasTopSegment && styles.chartSegmentTop, { height: timeoutHeight, backgroundColor: theme.colors.warning }]} />
                  ) : null}
                  {bucket.allowed > 0 ? (
                    <View style={[styles.chartSegment, !hasTopSegment && bucket.denied === 0 && styles.chartSegmentTop, { height: allowedHeight, backgroundColor: theme.colors.success }]} />
                  ) : null}
                  {bucket.denied > 0 ? (
                    <View style={[styles.chartSegment, styles.chartSegmentBottom, { height: deniedHeight, backgroundColor: theme.colors.error }]} />
                  ) : null}
                </View>
              </TooltipWrapper>
            </View>
            <View style={styles.chartLabelSlot}>
              {showLabel ? (
                <Text variant="labelSmall" style={[styles.chartLabel, { color: theme.colors.grey }]}> 
                  {bucket.hour}h
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function CountBadge({ value }: { value: number }) {
  const theme = useAppTheme();

  return (
    <View style={[styles.countBadge, { backgroundColor: theme.colors.error }]}> 
      <Text variant="labelMedium" style={{ color: theme.colors.onError }}>
        {value}
      </Text>
    </View>
  );
}

function TopDeniedRooms({ rooms }: { rooms: TopDeniedRoom[] }) {
  const theme = useAppTheme();

  return (
    <StyledCard style={styles.rankingCard}>
      <StyledCard.Content style={styles.rankingContent}>
        <View style={styles.rankingHeader}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.secondary }]}> 
            Aulas con más denegados
          </Text>
        </View>

        {rooms.length > 0 ? rooms.map((room, index) => (
          <View key={room.roomId} style={[styles.rankingRow, index === rooms.length - 1 && styles.lastRankingRow]}>
            <View style={styles.roomRankingMain}>
              <MaterialCommunityIcons name="door" size={28} color={theme.colors.warning} />
              <View style={styles.roomTextContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
                  {room.roomName} {room.roomCode}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.grey }} numberOfLines={1}>
                  Edificio {room.building} · Planta {room.floor}
                </Text>
              </View>
            </View>
            <CountBadge value={room.deniedCount} />
          </View>
        )) : (
          <View style={styles.emptyState}>
            <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
              Sin denegaciones en este rango
            </Text>
          </View>
        )}
      </StyledCard.Content>
    </StyledCard>
  );
}

function TopDeniedUsers({ users }: { users: TopDeniedUser[] }) {
  const theme = useAppTheme();

  return (
    <StyledCard style={styles.rankingCard}>
      <StyledCard.Content style={styles.rankingContent}>
        <View style={styles.rankingHeader}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.secondary }]}> 
            Usuarios con más denegados
          </Text>
        </View>

        {users.length > 0 ? users.map((user, index) => (
          <View key={user.userId} style={[styles.rankingRow, index === users.length - 1 && styles.lastRankingRow]}>
            <View style={styles.userRankingMain}>
              {user.avatar ? (
                <Avatar.Image size={36} source={{ uri: apiService.getImageUrl(user.avatar) }} />
              ) : (
                <Avatar.Text
                  size={36}
                  label={getInitials(user.name, user.lastname)}
                  color={theme.colors.onPrimary}
                  style={{ backgroundColor: theme.colors.error }}
                />
              )}

              <View style={styles.userTextContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
                  {user.name} {user.lastname}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.grey }} numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            </View>
            <View style={styles.rolesColumn}>
              {user.roles.map((role) => (
                <StyledChip key={role} color={getRoleColor(role, theme)}>
                  {getRoleLabel(role)}
                </StyledChip>
              ))}
            </View>
            <CountBadge value={user.deniedCount} />
          </View>
        )) : (
          <View style={styles.emptyState}>
            <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
              Sin denegaciones en este rango
            </Text>
          </View>
        )}
      </StyledCard.Content>
    </StyledCard>
  );
}

export default function AnalyticsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<AccessAnalyticsDateRange>('today');
  const { data, isLoading, error, refetch } = useAccessAnalyticsSummary({ date: dateRange, limit: 5 });

  const kpis = data?.kpis;
  const kpiCards = useMemo(() => [
    {
      title: 'Accesos',
      value: kpis?.totalAccesses ?? '...',
      icon: 'door-open' as const,
      color: theme.colors.tertiary,
      route: getFilteredLogsRoute(dateRange),
    },
    {
      title: 'Permitidos',
      value: kpis?.allowedAccesses ?? '...',
      icon: 'check-circle' as const,
      color: theme.colors.success,
      route: getFilteredLogsRoute(dateRange, 'permitido'),
    },
    {
      title: 'Denegados',
      value: kpis?.deniedAccesses ?? '...',
      icon: 'shield-alert' as const,
      color: theme.colors.error,
      route: getFilteredLogsRoute(dateRange, 'denegado'),
    },
    {
      title: 'Ratio denegados',
      value: kpis ? formatPercent(kpis.denialRate) : '...',
      icon: 'percent' as const,
      color: theme.colors.warning,
      route: getFilteredLogsRoute(dateRange, 'denegado'),
    },
  ], [dateRange, kpis, theme.colors.error, theme.colors.success, theme.colors.tertiary, theme.colors.warning]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando analíticas de accesos...
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return <ErrorState message="Error al cargar analíticas de accesos" onRetry={refetch} />;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
            Analíticas de accesos
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
            Resumen de {RANGE_LABELS[dateRange].toLowerCase()}
          </Text>
        </View>

        <SegmentedButtons
          value={dateRange}
          onValueChange={(value) => setDateRange(value as AccessAnalyticsDateRange)}
          buttons={[
            { value: 'today', label: 'Hoy' },
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mes' },
          ].map((button) => ({
            ...button,
            checkedColor: theme.colors.onTertiary,
            uncheckedColor: theme.colors.onSurfaceVariant,
            rippleColor: theme.colors.secondaryContainer,
            style: dateRange === button.value ? { backgroundColor: theme.colors.tertiary } : undefined,
          }))}
          density="small"
          style={[styles.rangeSelector, { backgroundColor: theme.colors.onTertiary }]}
        />
      </View>

      <View style={styles.kpiContainer}>
        {kpiCards.map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
            onPress={() => router.push(kpi.route)}
          />
        ))}
      </View>

      <StyledCard style={styles.chartCard}>
        <StyledCard.Content style={styles.chartCardContent}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.secondary }]}> 
            Actividad por hora
          </Text>
          <HourlyActivityChart data={data.hourlyActivity} />
        </StyledCard.Content>
      </StyledCard>

      <View style={styles.rankingsContainer}>
        <TopDeniedRooms rooms={data.topDeniedRooms} />
        <TopDeniedUsers users={data.topDeniedUsers} />
      </View>
    </ScrollView>
  );
}
