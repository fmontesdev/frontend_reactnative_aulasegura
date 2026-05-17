import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Avatar, Button, Dialog, IconButton, Portal, Text } from 'react-native-paper';
import { ColumnConfig, DataTable } from '../../../components/DataTable';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ErrorState } from '../../../components/ErrorState';
import { FormTextInput } from '../../../components/FormTextInput';
import { StyledSnackbar } from '../../../components/StyledSnackbar';
import { TooltipWrapper } from '../../../components/TooltipWrapper';
import { API_CONFIG } from '../../../constants';
import { useUpdateEventSchedule } from '../../../hooks/queries/useEventSchedules';
import { usePermissions } from '../../../hooks/queries/usePermissions';
import { useAppTheme } from '../../../theme';
import { PermissionResponse } from '../../../types/Permission';
import { EventStatus } from '../../../types/Schedule';
import { addOpacity } from '../../../utils/colorUtils';

const columns: ColumnConfig<PermissionResponse>[] = [
  { key: 'user', label: 'Solicitante', flex: 1.4, sortKey: (item) => `${item.user?.name ?? ''} ${item.user?.lastname ?? ''}` },
  { key: 'description', label: 'Descripción', flex: 1.6, sortKey: (item) => item.schedule.eventSchedule?.description ?? '' },
  { key: 'room', label: 'Aula', flex: 1, sortKey: (item) => `${item.room?.name ?? ''} ${item.room?.roomCode ?? ''}` },
  { key: 'date', label: 'Fecha', flex: 0.8, sortKey: (item) => item.schedule.eventSchedule?.startAt ?? '' },
  { key: 'startAt', label: 'Inicio', flex: 0.7, sortKey: (item) => item.schedule.eventSchedule?.startAt ?? '' },
  { key: 'endAt', label: 'Final', flex: 0.7, sortKey: (item) => item.schedule.eventSchedule?.endAt ?? '' },
  { key: 'actions', label: 'Acciones', flex: 1, sortable: false },
];

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

type ValidationAction = 'approve' | 'revoke';

type RevokeReservationFormData = {
  reservationStatusReason: string;
};

export default function ValidationsScreen() {
  const theme = useAppTheme();
  const { data, isLoading, error, isFetching, refetch } = usePermissions();
  const updateEventSchedule = useUpdateEventSchedule();
  const [selectedPermission, setSelectedPermission] = useState<PermissionResponse | null>(null);
  const [action, setAction] = useState<ValidationAction | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; variant: 'success' | 'error' }>({ visible: false, message: '', variant: 'success' });

  const { control, getValues, reset, formState: { errors } } = useForm<RevokeReservationFormData>({
    defaultValues: { reservationStatusReason: '' },
  });

  const pendingEventPermissions = useMemo(() => (
    (data ?? [])
      .filter((permission) => permission.schedule.type === 'event' && permission.schedule.eventSchedule?.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  ), [data]);

  const openAction = (permission: PermissionResponse, nextAction: ValidationAction) => {
    setSelectedPermission(permission);
    setAction(nextAction);
  };

  const closeAction = () => {
    setSelectedPermission(null);
    setAction(null);
    reset({ reservationStatusReason: '' });
  };

  const confirmAction = async () => {
    if (!selectedPermission || !action) return;

    const nextStatus: EventStatus = action === 'approve' ? 'approved' : 'revoked';
    const nextReservationStatusReason = action === 'approve'
      ? 'Reserva aprobada'
      : getValues('reservationStatusReason').trim() || 'Reserva denegada';

    try {
      await updateEventSchedule.mutateAsync({
        scheduleId: selectedPermission.scheduleId,
        data: { status: nextStatus, reservationStatusReason: nextReservationStatusReason },
      });
      setSnackbar({ visible: true, message: action === 'approve' ? 'Reserva aprobada' : 'Reserva denegada', variant: 'success' });
      closeAction();
    } catch (caughtError) {
      setSnackbar({ visible: true, message: caughtError instanceof Error ? caughtError.message : 'Error al validar la reserva', variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Cargando validaciones...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar validaciones" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Validaciones</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>Reservas pendientes.</Text>
      </View>

      <DataTable
        data={pendingEventPermissions}
        columns={columns}
        keyExtractor={(permission) => `${permission.userId}-${permission.roomId}-${permission.scheduleId}`}
        renderRow={(permission) => {
          const eventSchedule = permission.schedule.eventSchedule;

          return (
            <>
              <View style={styles.cellWithAvatar}>
                {permission.user?.avatar ? (
                  <Avatar.Image
                    size={32}
                    source={{ uri: `${API_CONFIG.IMAGE_SERVER_URL}/${permission.user.avatar}` }}
                  />
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
              <View style={styles.cellActions}>
                <TooltipWrapper title="Aprobar"><IconButton icon="check" size={20} iconColor={theme.colors.success} onPress={() => openAction(permission, 'approve')} style={[styles.actionButton, { borderColor: addOpacity(theme.colors.success, 0.3) }]} /></TooltipWrapper>
                <TooltipWrapper title="Revocar"><IconButton icon="close" size={20} iconColor={theme.colors.error} onPress={() => openAction(permission, 'revoke')} style={[styles.actionButton, { borderColor: addOpacity(theme.colors.error, 0.3) }]} /></TooltipWrapper>
              </View>
            </>
          );
        }}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay reservas pendientes de validación"
        defaultSortKey="startAt"
        defaultSortOrder="desc"
      />

      <ConfirmDialog
        visible={!!selectedPermission && action === 'approve'}
        onDismiss={closeAction}
        onConfirm={confirmAction}
        title="Aprobar reserva"
        message="¿Seguro que deseas aprobar la reserva"
        highlightedText={selectedPermission?.schedule.eventSchedule?.description ?? ''}
        confirmText="Aprobar"
        isLoading={updateEventSchedule.isPending}
        variant="success"
      />

      <Portal>
        <Dialog visible={!!selectedPermission && action === 'revoke'} onDismiss={closeAction} style={[styles.dialog, { backgroundColor: theme.colors.surface }]}>
          <Dialog.Title style={{ color: theme.colors.error }}>Denegar reserva</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Text variant="bodyLarge">
              ¿Seguro que deseas denegar la reserva{' '}
              {selectedPermission?.schedule.eventSchedule?.description && (
                <Text style={{ fontWeight: '700', color: theme.colors.secondary }}>
                  {selectedPermission.schedule.eventSchedule.description}
                </Text>
              )}
              ?
            </Text>
            <FormTextInput
              control={control}
              name="reservationStatusReason"
              label="Motivo de denegación (opcional)"
              errors={errors}
              multiline
              numberOfLines={3}
              disabled={updateEventSchedule.isPending}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="outlined"
              onPress={closeAction}
              textColor={theme.colors.tertiary}
              contentStyle={styles.dialogButton}
              labelStyle={styles.dialogButtonLabel}
            >
              Cancelar
            </Button>
            <Button
              onPress={confirmAction}
              loading={updateEventSchedule.isPending}
              disabled={updateEventSchedule.isPending}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              contentStyle={styles.dialogButton}
            >
              Denegar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <StyledSnackbar visible={snackbar.visible} onDismiss={() => setSnackbar((current) => ({ ...current, visible: false }))} message={snackbar.message} variant={snackbar.variant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16 },
  header: { paddingTop: 18, paddingBottom: 18, gap: 6 },
  cellDescription: { flex: 1.6 },
  cell: { flex: 1 },
  cellWithAvatar: { flex: 1.4, flexDirection: 'row', alignItems: 'center' },
  cellDate: { flex: 0.8 },
  cellTime: { flex: 0.7 },
  cellActions: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  strong: { fontWeight: '600' },
  userName: { fontWeight: '600', marginLeft: 12 },
  actionButton: { marginVertical: -2, marginLeft: -2, borderWidth: 1, borderRadius: 20 },
  dialog: { alignSelf: 'center' },
  dialogContent: { gap: 16 },
  dialogButton: { paddingHorizontal: 10 },
  dialogButtonLabel: { marginVertical: 9 },
});
