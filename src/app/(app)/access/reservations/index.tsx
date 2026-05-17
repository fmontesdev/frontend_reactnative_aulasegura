import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Avatar, Button, Text } from 'react-native-paper';
import { ColumnConfig, DataTable } from '../../../../components/DataTable';
import { ErrorState } from '../../../../components/ErrorState';
import { StyledChip } from '../../../../components/StyledChip';
import { usePermissions } from '../../../../hooks/queries/usePermissions';
import apiService from '../../../../services/apiService';
import { useAppTheme } from '../../../../theme';
import { PermissionResponse } from '../../../../types/Permission';

const columns: ColumnConfig<PermissionResponse>[] = [
  { key: 'user', label: 'Solicitante', flex: 1.4, sortKey: (item) => `${item.user?.name ?? ''} ${item.user?.lastname ?? ''}` },
  { key: 'description', label: 'Descripción', flex: 1.6, sortKey: (item) => item.schedule.eventSchedule?.description ?? '' },
  { key: 'room', label: 'Aula', flex: 1, sortKey: (item) => `${item.room?.name ?? ''} ${item.room?.roomCode ?? ''}` },
  { key: 'date', label: 'Fecha', flex: 0.8, sortKey: (item) => item.schedule.eventSchedule?.startAt ?? '' },
  { key: 'startAt', label: 'Inicio', flex: 0.7, sortKey: (item) => item.schedule.eventSchedule?.startAt ?? '' },
  { key: 'endAt', label: 'Final', flex: 0.7, sortKey: (item) => item.schedule.eventSchedule?.endAt ?? '' },
  { key: 'status', label: 'Estado', flex: 0.8, sortKey: (item) => item.schedule.eventSchedule?.status ?? '' },
];

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  revoked: 'Revocada',
  active: 'Activa',
  expired: 'Expirada',
};

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-ES');
}

function formatTime(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getUserName(permission: PermissionResponse) {
  if (!permission.user) return permission.userId;
  return `${permission.user.name} ${permission.user.lastname}`;
}

function getRoomLabel(permission: PermissionResponse) {
  if (!permission.room) return `Aula ${permission.roomId}`;
  return `${permission.room.name} ${permission.room.roomCode}`;
}

export default function ReservationsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { data, isLoading, error, isFetching, refetch } = usePermissions();

  const eventPermissions = useMemo(() => (
    (data ?? [])
      .filter((permission) => permission.schedule.type === 'event')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  ), [data]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Cargando reservas...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar reservas y temporales" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Reservas / pases</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>Permisos de evento filtrados desde /permissions.</Text>
        </View>
        <Button icon="plus" mode="contained" onPress={() => router.push('/access/reservations/create')} buttonColor={theme.colors.success}>Mi reserva</Button>
      </View>

      <DataTable
        data={eventPermissions}
        columns={columns}
        keyExtractor={(permission) => `${permission.userId}-${permission.roomId}-${permission.scheduleId}`}
        renderRow={(permission) => {
          const eventSchedule = permission.schedule.eventSchedule;

          return (
            <>
              <View style={styles.cellWithAvatar}>
                {permission.user?.avatar ? (
                  <Avatar.Image size={32} source={{ uri: apiService.getImageUrl(permission.user.avatar) }} />
                ) : (
                  <Avatar.Text size={32} label="-" />
                )}
                <Text variant="bodyMedium" style={styles.userName}>{getUserName(permission)}</Text>
              </View>
              <View style={styles.cellDescription}><Text variant="bodyMedium" style={styles.strong}>{eventSchedule?.description ?? '-'}</Text></View>
              <View style={styles.cell}><Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{getRoomLabel(permission)}</Text></View>
              <View style={styles.cellDate}><Text variant="bodySmall" style={{ color: theme.colors.grey }}>{formatDate(eventSchedule?.startAt)}</Text></View>
              <View style={styles.cellTime}><Text variant="bodySmall" style={{ color: theme.colors.grey }}>{formatTime(eventSchedule?.startAt)}</Text></View>
              <View style={styles.cellTime}><Text variant="bodySmall" style={{ color: theme.colors.grey }}>{formatTime(eventSchedule?.endAt)}</Text></View>
              <View style={styles.cellStatus}>
                <StyledChip
                  color={eventSchedule?.status === 'revoked' ? theme.colors.error : eventSchedule?.status === 'approved' || eventSchedule?.status === 'active' ? theme.colors.success : theme.colors.warning}
                  style={styles.statusChip}
                >
                  {statusLabels[eventSchedule?.status ?? ''] ?? '-'}
                </StyledChip>
              </View>
            </>
          );
        }}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay reservas ni permisos temporales"
        defaultSortKey="startAt"
        defaultSortOrder="desc"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, paddingBottom: 18, gap: 16 },
  cellDescription: { flex: 1.6 },
  cell: { flex: 1 },
  cellWithAvatar: { flex: 1.4, flexDirection: 'row', alignItems: 'center' },
  cellDate: { flex: 0.8 },
  cellTime: { flex: 0.7 },
  cellStatus: { flex: 0.8, alignItems: 'flex-start' },
  statusChip: { alignSelf: 'flex-start' },
  strong: { fontWeight: '600' },
  userName: { fontWeight: '600', marginLeft: 12 },
});
