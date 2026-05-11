import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Avatar, Text } from 'react-native-paper';
import { useFilters } from '../../../../contexts/FilterContext';
import { usePaginationParams } from '../../../../hooks/usePaginationParams';
import { useAccessLogs } from '../../../../hooks/queries/useAccessLogs';
import { useAppTheme } from '../../../../theme';
import { AccessLog, AccessMethod, AccessStatus } from '../../../../types/AccessLog';
import { DataTable } from '../../../../components/DataTable';
import { ErrorState } from '../../../../components/ErrorState';
import { StyledChip } from '../../../../components/StyledChip';
import apiService from '../../../../services/apiService';
import { getAccessLogReasonLabel } from '../../../../utils/accessLogReasonStatusUtils';
import { getAccessLogsColumns } from './columns.config.accessLogs';
import { styles } from './accessLogs.styles';
import { AccessLogQuickFilters } from './AccessLogQuickFilters';

function getInitials(name: string, lastname: string) {
  const firstInitial = name.trim().charAt(0);
  const lastInitial = lastname.trim().charAt(0);
  return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
}

function formatAccessDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha desconocida';
  }

  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getAccessMethodConfig(method: AccessMethod, theme: ReturnType<typeof useAppTheme>) {
  const config: Record<AccessMethod, { color: string; label: string }> = {
    rfid: { color: theme.colors.tertiary, label: 'NFC física' },
    nfc: { color: theme.colors.warning, label: 'NFC móvil' },
    qr: { color: theme.colors.primary, label: 'QR' },
  };

  return config[method];
}

function getAccessStatusConfig(status: AccessStatus, theme: ReturnType<typeof useAppTheme>) {
  const config: Record<AccessStatus, { color: string; label: string; icon: string }> = {
    allowed: { color: theme.colors.success, label: 'Permitido', icon: 'check-circle' },
    denied: { color: theme.colors.error, label: 'Denegado', icon: 'alert-circle' },
    timeout: { color: theme.colors.warning, label: 'Caducado', icon: 'clock-alert' },
    exit: { color: theme.colors.grey, label: 'Salida', icon: 'logout' },
  };

  return config[status];
}

export default function LogsScreen() {
  const theme = useAppTheme();
  const { filters } = useFilters();
  const { page: currentPage, limit: currentLimit, setPage, setLimit } = usePaginationParams({ filters });

  const { data: accessLogsResponse, isLoading, isFetching, error, refetch } = useAccessLogs({
    page: currentPage,
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });

  const accessLogs = accessLogsResponse?.data || [];
  const pagination = accessLogsResponse?.meta;
  const columns = getAccessLogsColumns();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando historial de accesos...
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar historial de accesos" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.secondary }]}>
          Historial de Accesos
        </Text>

        <View style={styles.quickFilters}>
          <AccessLogQuickFilters />
        </View>
      </View>

      <DataTable
        data={accessLogs}
        columns={columns}
        keyExtractor={(accessLog) => String(accessLog.accessLogId)}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        limitOptions={[5, 10, 20, 50]}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay logs de acceso disponibles"
        renderRow={(accessLog: AccessLog) => {
          const method = getAccessMethodConfig(accessLog.accessMethod, theme);
          const status = getAccessStatusConfig(accessLog.accessStatus, theme);
          const userName = `${accessLog.user.name} ${accessLog.user.lastname}`;
          const avatar = accessLog.user.avatar;
          const reason = getAccessLogReasonLabel(accessLog.reasonStatus);

          return (
            <>
              <View style={styles.cellWithAvatar}>
                {avatar ? (
                  <Avatar.Image size={32} source={{ uri: apiService.getImageUrl(avatar) }} />
                ) : (
                  <Avatar.Text
                    size={32}
                    label={getInitials(accessLog.user.name, accessLog.user.lastname)}
                    color={theme.colors.onPrimary}
                    style={{ backgroundColor: status.color }}
                  />
                )}
                <Text variant="bodyMedium" style={{ fontWeight: '600', marginLeft: 12 }}>
                  {userName}
                </Text>
              </View>

              <View style={styles.cellType}>
                <View style={styles.chipWrapper}>
                  <StyledChip color={method.color}>{method.label}</StyledChip>
                </View>
              </View>

              <View style={styles.cellRoom}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
                  Aula {accessLog.room.roomCode}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.grey }} numberOfLines={1}>
                  {reason}
                </Text>
              </View>

              <View style={styles.cellReader}>
                <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                  Lector {accessLog.readerId}
                </Text>
              </View>

              <View style={styles.cellDate}>
                <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                  {formatAccessDate(accessLog.createdAt)}
                </Text>
              </View>

              <View style={styles.cellStatus}>
                <View style={styles.chipWrapper}>
                  <StyledChip color={status.color} icon={status.icon}>
                    {status.label}
                  </StyledChip>
                </View>
              </View>
            </>
          );
        }}
      />
    </View>
  );
}
