import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Button, IconButton, Text } from 'react-native-paper';
import { DataTable, ColumnConfig } from '../../../../components/DataTable';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ErrorState } from '../../../../components/ErrorState';
import { StyledChip } from '../../../../components/StyledChip';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { dayOptions } from '../../../../components/WeeklyScheduleForm';
import { useSchedules, useSoftDeleteSchedule } from '../../../../hooks/queries/useSchedules';
import { useAppTheme } from '../../../../theme';
import { ScheduleResponse } from '../../../../types/Schedule';
import { addOpacity } from '../../../../utils/colorUtils';

const columns: ColumnConfig<ScheduleResponse>[] = [
  { key: 'day', label: 'Día', flex: 1.2, sortKey: (item) => item.weeklySchedule?.dayOfWeek ?? 0 },
  { key: 'startTime', label: 'Inicio', flex: 1, sortKey: (item) => item.weeklySchedule?.startTime ?? '' },
  { key: 'endTime', label: 'Fin', flex: 1, sortKey: (item) => item.weeklySchedule?.endTime ?? '' },
  { key: 'status', label: 'Estado', flex: 1, sortKey: (item) => Number(item.isActive) },
  { key: 'actions', label: 'Acciones', flex: 1, sortable: false },
];

function getDayLabel(dayOfWeek?: number) {
  return dayOptions.find((day) => day.value === dayOfWeek)?.label ?? '-';
}

function formatTime(time?: string) {
  return time ? time.slice(0, 5) : '-';
}

export default function SchedulesScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { data, isLoading, error, isFetching, refetch } = useSchedules();
  const softDeleteSchedule = useSoftDeleteSchedule();
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleResponse | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; variant: 'success' | 'error' }>({
    visible: false,
    message: '',
    variant: 'success',
  });

  const weeklySchedules = useMemo(() => (
    (data ?? []).filter((schedule) => schedule.type === 'weekly' && schedule.weeklySchedule)
  ), [data]);

  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await softDeleteSchedule.mutateAsync(scheduleToDelete.scheduleId);
      setSnackbar({ visible: true, message: 'Horario desactivado correctamente', variant: 'success' });
      setScheduleToDelete(null);
    } catch (caughtError) {
      setSnackbar({ visible: true, message: caughtError instanceof Error ? caughtError.message : 'Error al desactivar el horario', variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Cargando horarios...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar horarios" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Horarios</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>Slots para los horarios semanales.</Text>
        </View>
        <Button icon="plus" mode="contained" onPress={() => router.push('/access/schedules/create')} buttonColor={theme.colors.success}>Nuevo horario</Button>
      </View>

      <DataTable
        data={weeklySchedules}
        columns={columns}
        keyExtractor={(schedule) => String(schedule.scheduleId)}
        renderRow={(schedule) => (
          <>
            <View style={styles.cellDay}><Text variant="bodyMedium" style={styles.strong}>{getDayLabel(schedule.weeklySchedule?.dayOfWeek)}</Text></View>
            <View style={styles.cell}><Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{formatTime(schedule.weeklySchedule?.startTime)}</Text></View>
            <View style={styles.cell}><Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{formatTime(schedule.weeklySchedule?.endTime)}</Text></View>
            <View style={styles.cellStatus}>
              <StyledChip color={schedule.isActive ? theme.colors.success : theme.colors.grey}>{schedule.isActive ? 'Activo' : 'Inactivo'}</StyledChip>
            </View>
            <View style={styles.cellActions}>
              <TooltipWrapper title="Editar"><IconButton icon="pencil" size={20} iconColor={theme.colors.secondary} onPress={() => router.push(`/access/schedules/${schedule.scheduleId}`)} style={[styles.actionButton, { borderColor: addOpacity(theme.colors.secondary, 0.3) }]} /></TooltipWrapper>
              <TooltipWrapper title="Desactivar"><IconButton icon="toggle-switch-off" size={20} iconColor={theme.colors.error} onPress={() => setScheduleToDelete(schedule)} style={[styles.actionButton, { borderColor: addOpacity(theme.colors.error, 0.3) }]} /></TooltipWrapper>
            </View>
          </>
        )}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay horarios semanales disponibles"
        defaultSortKey="day"
      />

      <ConfirmDialog visible={!!scheduleToDelete} onDismiss={() => setScheduleToDelete(null)} onConfirm={confirmDelete} title="Desactivar horario" message="¿Seguro que deseas desactivar el horario" highlightedText={scheduleToDelete ? `${getDayLabel(scheduleToDelete.weeklySchedule?.dayOfWeek)} ${formatTime(scheduleToDelete.weeklySchedule?.startTime)}-${formatTime(scheduleToDelete.weeklySchedule?.endTime)}` : ''} confirmText="Desactivar" isLoading={softDeleteSchedule.isPending} variant="danger" />
      <StyledSnackbar visible={snackbar.visible} onDismiss={() => setSnackbar((current) => ({ ...current, visible: false }))} message={snackbar.message} variant={snackbar.variant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, paddingBottom: 18, gap: 16 },
  cellDay: { flex: 1.2 },
  cell: { flex: 1 },
  cellStatus: { flex: 1, alignItems: 'flex-start' },
  cellActions: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  strong: { fontWeight: '600' },
  actionButton: { marginVertical: -2, marginLeft: -2, borderWidth: 1, borderRadius: 20 },
});
