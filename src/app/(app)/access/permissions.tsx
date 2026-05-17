import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Dialog, Icon, IconButton, Portal, Text } from 'react-native-paper';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ErrorState } from '../../../components/ErrorState';
import { FormSingleSelect } from '../../../components/FormSingleSelect';
import { StyledSnackbar } from '../../../components/StyledSnackbar';
import { WeeklyPermissionForm } from '../../../components/WeeklyPermissionForm';
import { useCreateWeeklyPermission, usePermissions, useSoftDeletePermission, useUpdateWeeklyPermission } from '../../../hooks/queries/usePermissions';
import { useSchedules } from '../../../hooks/queries/useSchedules';
import { useUsers } from '../../../hooks/queries/useUsers';
import { WeeklyPermissionFormData } from '../../../schemas/access.schema';
import { useAppTheme } from '../../../theme';
import apiService from '../../../services/apiService';
import { PermissionResponse, UpdateWeeklyPermissionData } from '../../../types/Permission';
import { ScheduleResponse } from '../../../types/Schedule';
import { RoleName, User } from '../../../types/User';
import { addOpacity } from '../../../utils/colorUtils';

const weekdays = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
];

type UserSelectorFormData = {
  userId: string;
};

type PermissionDialogState =
  | { mode: 'create'; schedule: ScheduleResponse }
  | { mode: 'edit'; permission: PermissionResponse }
  | null;

function getUserName(user: User) {
  return `${user.name} ${user.lastname}`;
}

function getUserInitials(user: User) {
  return `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
}

function isTeacher(user?: User | null) {
  return Array.isArray(user?.roles) && user.roles.includes(RoleName.TEACHER);
}

function isPermissionActive(permission: PermissionResponse) {
  return permission.isActive ?? permission.schedule.isActive;
}

function formatTimeSlot(schedule: ScheduleResponse) {
  const weekly = schedule.weeklySchedule;
  return weekly ? `${weekly.startTime.slice(0, 5)} - ${weekly.endTime.slice(0, 5)}` : '-';
}

function getSlotKey(schedule: ScheduleResponse) {
  const weekly = schedule.weeklySchedule;
  return weekly ? `${weekly.startTime}-${weekly.endTime}` : `schedule-${schedule.scheduleId}`;
}

function getRoomLabel(permission: PermissionResponse) {
  return permission.room ? `${permission.room.name} ${permission.room.roomCode}` : `Aula ${getPermissionRoomId(permission)}`;
}

function getPermissionUserId(permission: PermissionResponse) {
  return permission.userId ?? permission.user?.userId ?? '';
}

function getPermissionRoomId(permission: PermissionResponse) {
  return permission.roomId ?? permission.room?.roomId ?? 0;
}

function getPermissionScheduleId(permission: PermissionResponse) {
  return permission.scheduleId ?? permission.schedule.scheduleId;
}

function getPermissionAssignmentId(permission: PermissionResponse) {
  return permission.assignment?.assignmentId ?? null;
}

function getPermissionKey(permission: PermissionResponse) {
  return `${getPermissionUserId(permission)}-${getPermissionRoomId(permission)}-${getPermissionScheduleId(permission)}`;
}

export default function PermissionsScreen() {
  const theme = useAppTheme();
  const permissionsQuery = usePermissions();
  const schedulesQuery = useSchedules();
  const usersQuery = useUsers({ limit: 100 });
  const createWeeklyPermission = useCreateWeeklyPermission();
  const updateWeeklyPermission = useUpdateWeeklyPermission();
  const softDeletePermission = useSoftDeletePermission();
  const [permissionDialog, setPermissionDialog] = useState<PermissionDialogState>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<PermissionResponse | null>(null);
  const [selectedPermissionKey, setSelectedPermissionKey] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; variant: 'success' | 'error' }>({ visible: false, message: '', variant: 'success' });

  const { control, watch, formState: { errors } } = useForm<UserSelectorFormData>({
    defaultValues: { userId: '' },
  });

  const selectedUserId = watch('userId');
  const users = usersQuery.data?.data ?? [];
  const selectedUser = users.find((user) => user.userId === selectedUserId);

  const weeklySchedules = useMemo(() => (
    (schedulesQuery.data ?? [])
      .filter((schedule) => schedule.type === 'weekly' && schedule.weeklySchedule && schedule.weeklySchedule.dayOfWeek >= 1 && schedule.weeklySchedule.dayOfWeek <= 5)
      .sort((a, b) => {
        const aWeekly = a.weeklySchedule;
        const bWeekly = b.weeklySchedule;
        if (!aWeekly || !bWeekly) return 0;
        return aWeekly.startTime.localeCompare(bWeekly.startTime) || aWeekly.endTime.localeCompare(bWeekly.endTime) || aWeekly.dayOfWeek - bWeekly.dayOfWeek;
      })
  ), [schedulesQuery.data]);

  const slotKeys = useMemo(() => Array.from(new Set(weeklySchedules.map(getSlotKey))), [weeklySchedules]);

  const permissionsByScheduleId = useMemo(() => {
    const map = new Map<number, PermissionResponse>();
    (permissionsQuery.data ?? [])
      .filter((permission) => getPermissionUserId(permission) === selectedUserId && permission.schedule.type === 'weekly' && isPermissionActive(permission))
      .forEach((permission) => map.set(getPermissionScheduleId(permission), permission));
    return map;
  }, [permissionsQuery.data, selectedUserId]);

  const userOptions = useMemo(() => [
    { value: '', label: 'Selecciona usuario' },
    ...users.map((user) => ({
      value: user.userId,
      label: getUserName(user),
      avatarUrl: user.avatar ? apiService.getImageUrl(user.avatar) : undefined,
      avatarLabel: getUserInitials(user),
    })),
  ], [users]);

  const getScheduleForCell = (slotKey: string, dayOfWeek: number) => weeklySchedules.find((schedule) => {
    const weekly = schedule.weeklySchedule;
    return weekly ? getSlotKey(schedule) === slotKey && weekly.dayOfWeek === dayOfWeek : false;
  });

  const getSlotLabel = (slotKey: string) => {
    const schedule = weeklySchedules.find((item) => getSlotKey(item) === slotKey);
    return schedule ? formatTimeSlot(schedule) : '-';
  };

  const getCurrentDialogUser = () => {
    if (permissionDialog?.mode !== 'edit') return selectedUser;

    const permissionUserId = getPermissionUserId(permissionDialog.permission);
    return users.find((user) => user.userId === permissionUserId) ?? permissionDialog.permission.user ?? selectedUser;
  };

  const closePermissionDialog = () => setPermissionDialog(null);

  const handlePermissionSubmit = async (data: WeeklyPermissionFormData) => {
    const dialogUser = getCurrentDialogUser();
    if (!dialogUser || !permissionDialog) return;

    const dialogUserIsTeacher = isTeacher(dialogUser);
    if (dialogUserIsTeacher && !data.assignmentId) {
      setSnackbar({ visible: true, message: 'Selecciona una asignación docente para este profesor', variant: 'error' });
      return;
    }

    try {
      if (permissionDialog.mode === 'create') {
        const payload = dialogUserIsTeacher
          ? { userId: dialogUser.userId, roomId: data.roomId, scheduleId: permissionDialog.schedule.scheduleId, assignmentId: data.assignmentId! }
          : { userId: dialogUser.userId, roomId: data.roomId, scheduleId: permissionDialog.schedule.scheduleId };
        await createWeeklyPermission.mutateAsync(payload);
        setSnackbar({ visible: true, message: 'Permiso semanal creado', variant: 'success' });
      } else {
        const permission = permissionDialog.permission;
        const updateData: UpdateWeeklyPermissionData = {};

        if (data.roomId !== getPermissionRoomId(permission)) {
          updateData.newRoomId = data.roomId;
        }

        if (dialogUserIsTeacher && data.assignmentId !== getPermissionAssignmentId(permission)) {
          updateData.newAssignmentId = data.assignmentId!;
        }

        if (Object.keys(updateData).length === 0) {
          setSnackbar({ visible: true, message: 'No hay cambios para guardar', variant: 'success' });
          closePermissionDialog();
          return;
        }

        await updateWeeklyPermission.mutateAsync({
          userId: getPermissionUserId(permission),
          roomId: getPermissionRoomId(permission),
          scheduleId: getPermissionScheduleId(permission),
          data: updateData,
        });
        setSnackbar({ visible: true, message: 'Permiso semanal actualizado', variant: 'success' });
      }

      closePermissionDialog();
    } catch (caughtError) {
      setSnackbar({ visible: true, message: caughtError instanceof Error ? caughtError.message : 'Error al guardar el permiso semanal', variant: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return;

    try {
      await softDeletePermission.mutateAsync({
        userId: getPermissionUserId(permissionToDelete),
        roomId: getPermissionRoomId(permissionToDelete),
        scheduleId: getPermissionScheduleId(permissionToDelete),
      });
      setSnackbar({ visible: true, message: 'Permiso semanal desactivado', variant: 'success' });
      setPermissionToDelete(null);
    } catch (caughtError) {
      setSnackbar({ visible: true, message: caughtError instanceof Error ? caughtError.message : 'Error al desactivar el permiso semanal', variant: 'error' });
    }
  };

  const renderPermissionCard = (permission: PermissionResponse) => {
    const assignment = permission.assignment;
    const courseLabel = assignment ? assignment.course.name || assignment.course.courseCode : null;
    const subjectLabel = assignment ? assignment.subject.name || assignment.subject.subjectCode : null;
    const permissionKey = getPermissionKey(permission);
    const isSelected = selectedPermissionKey === permissionKey;

    return (
      <View style={[styles.permissionContent, { backgroundColor: addOpacity(theme.colors.tertiary, isSelected ? 0.1 : 0.06) }]}> 
        <Pressable
          onPress={() => setSelectedPermissionKey((current) => (current === permissionKey ? null : permissionKey))}
          style={styles.permissionDetails}
        >
          <View style={styles.roomLine}>
            <View style={[styles.roomIconBadge, { backgroundColor: addOpacity(theme.colors.tertiary, 0.14) }]}> 
              <Icon source="door" size={15} color={theme.colors.tertiary} />
            </View>
            <Text variant="bodySmall" style={[styles.strong, styles.permissionText]} numberOfLines={1}>
              {getRoomLabel(permission)}
            </Text>
          </View>

          {assignment ? (
            <View style={styles.assignmentRows}>
              <View style={styles.assignmentLine}>
                <Icon source="book-education" size={14} color={theme.colors.warning} />
                <Text variant="bodySmall" style={styles.permissionText} numberOfLines={1}>
                  {courseLabel}
                </Text>
              </View>
              <View style={styles.assignmentLine}>
                <Icon source="book-open-variant" size={14} color={theme.colors.quaternary} />
                <Text variant="bodySmall" style={styles.permissionText} numberOfLines={1}>
                  {subjectLabel}
                </Text>
              </View>
            </View>
          ) : null}
        </Pressable>

        {isSelected ? (
          <View pointerEvents="box-none" style={[styles.cellActions, { backgroundColor: addOpacity(theme.colors.onPrimary, 0.92) }]}> 
            <IconButton
              icon="pencil"
              size={16}
              iconColor={theme.colors.secondary}
              onPress={() => {
                setSelectedPermissionKey(null);
                setPermissionDialog({ mode: 'edit', permission });
              }}
              style={[styles.actionButton, { borderColor: addOpacity(theme.colors.secondary, 0.3) }]}
            />
            <IconButton
              icon="delete"
              size={16}
              iconColor={theme.colors.error}
              onPress={() => {
                setSelectedPermissionKey(null);
                setPermissionToDelete(permission);
              }}
              style={[styles.actionButton, { borderColor: addOpacity(theme.colors.error, 0.3) }]}
            />
          </View>
        ) : null}
      </View>
    );
  };

  const isLoading = permissionsQuery.isLoading || schedulesQuery.isLoading || usersQuery.isLoading;
  const error = permissionsQuery.error || schedulesQuery.error || usersQuery.error;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Cargando permisos semanales...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar permisos semanales" onRetry={() => { permissionsQuery.refetch(); schedulesQuery.refetch(); usersQuery.refetch(); }} />;
  }

  const dialogUser = getCurrentDialogUser();
  const dialogUserIsTeacher = isTeacher(dialogUser);
  const dialogSchedule = permissionDialog?.mode === 'create' ? permissionDialog.schedule : permissionDialog?.permission.schedule;
  const dialogInitialPermission = permissionDialog?.mode === 'edit' ? permissionDialog.permission : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Permisos semanales</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>Selecciona un usuario para gestionar sus permisos por horario.</Text>
      </View>

      <View style={styles.selectorContainer}>
        <FormSingleSelect
          control={control}
          name="userId"
          label="Usuario"
          errors={errors}
          options={userOptions}
          isLoading={usersQuery.isFetching}
          emptyText="No hay usuarios disponibles"
        />
      </View>

      {!selectedUser ? (
        <View style={[styles.emptyState, { borderColor: addOpacity(theme.colors.tertiary, 0.25), backgroundColor: theme.colors.surface }]}> 
          <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>Selecciona un usuario</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>Antes de ver el horario semanal, necesitas elegir el usuario a consultar.</Text>
        </View>
      ) : (
        <View style={[styles.gridTable, { backgroundColor: theme.colors.onPrimary, borderColor: theme.colors.outlineVariant }]}> 
          <View style={[styles.gridRow, styles.gridHeader, { backgroundColor: theme.colors.tertiary }]}>
            <View style={[styles.timeHeader, styles.gridHeaderCell]}>
              <Text variant="labelLarge" style={{ color: theme.colors.onPrimary, fontWeight: '500' }}>Hora</Text>
            </View>
            {weekdays.map((day) => (
              <View key={day.value} style={[styles.dayHeader, styles.gridHeaderCell]}>
                <Text variant="labelLarge" style={{ color: theme.colors.onPrimary, fontWeight: '500' }}>{day.label}</Text>
              </View>
            ))}
          </View>

          {slotKeys.length > 0 ? slotKeys.map((slotKey, index) => (
            <View key={slotKey} style={[styles.gridRow, index === slotKeys.length - 1 && styles.gridLastRow, { borderBottomColor: theme.colors.outlineVariant }]}> 
              <View style={[styles.timeCell, { borderRightColor: theme.colors.outlineVariant }]}> 
                <Text variant="bodySmall" style={[styles.strong, { color: theme.colors.grey }]}>{getSlotLabel(slotKey)}</Text>
              </View>
              {weekdays.map((day) => {
                const schedule = getScheduleForCell(slotKey, day.value);
                const permission = schedule ? permissionsByScheduleId.get(schedule.scheduleId) : undefined;

                return (
                  <View key={`${slotKey}-${day.value}`} style={[styles.permissionCell, { borderRightColor: theme.colors.outlineVariant }]}> 
                    {schedule ? (
                      permission ? (
                        renderPermissionCard(permission)
                      ) : (
                        <IconButton
                          mode="outlined"
                          icon="plus"
                          size={18}
                          iconColor={theme.colors.tertiary}
                          onPress={() => setPermissionDialog({ mode: 'create', schedule })}
                          style={[styles.createButton, { borderColor: theme.colors.outline }]}
                          accessibilityLabel="Crear permiso semanal"
                        />
                      )
                    ) : (
                      <Text variant="bodySmall" style={{ color: theme.colors.grey }}>Sin slot</Text>
                    )}
                  </View>
                );
              })}
            </View>
          )) : (
            <View style={[styles.emptyState, { borderColor: addOpacity(theme.colors.warning, 0.35), backgroundColor: theme.colors.surface }]}> 
              <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>No hay horarios semanales</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>Crea slots semanales antes de asignar permisos.</Text>
            </View>
          )}
        </View>
      )}

      <Portal>
        <Dialog visible={!!permissionDialog && !!dialogUser && !!dialogSchedule} onDismiss={closePermissionDialog} style={[styles.dialog, { backgroundColor: theme.colors.surface }]}> 
          <Dialog.Title style={{ color: theme.colors.secondary }}>{permissionDialog?.mode === 'edit' ? 'Editar permiso semanal' : 'Crear permiso semanal'}</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            {dialogUser && dialogSchedule ? (
              <WeeklyPermissionForm
                mode={permissionDialog?.mode ?? 'create'}
                user={dialogUser}
                schedule={dialogSchedule}
                isTeacher={dialogUserIsTeacher}
                initialData={dialogInitialPermission}
                onSubmit={handlePermissionSubmit}
                onCancel={closePermissionDialog}
                isLoading={createWeeklyPermission.isPending || updateWeeklyPermission.isPending}
              />
            ) : null}
          </Dialog.Content>
        </Dialog>
      </Portal>

      <ConfirmDialog
        visible={!!permissionToDelete}
        onDismiss={() => setPermissionToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Desactivar permiso semanal"
        message="¿Seguro que deseas desactivar el permiso de"
        highlightedText={permissionToDelete ? getRoomLabel(permissionToDelete) : ''}
        confirmText="Desactivar"
        isLoading={softDeletePermission.isPending}
        variant="danger"
      />

      <StyledSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={() => setSnackbar((current) => ({ ...current, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16 },
  header: { paddingTop: 18, paddingBottom: 18, gap: 6 },
  selectorContainer: { maxWidth: 520, paddingBottom: 16 },
  emptyState: { borderWidth: 1, borderRadius: 16, padding: 24, gap: 8, maxWidth: 680 },
  gridTable: { width: '100%', maxWidth: '100%', borderWidth: 1, borderRadius: 30, overflow: 'hidden', marginBottom: 8 },
  gridRow: { flexDirection: 'row', borderBottomWidth: 1 },
  gridLastRow: { borderBottomWidth: 0 },
  gridHeader: { borderBottomWidth: 0, paddingVertical: 0, paddingHorizontal: 16 },
  gridHeaderCell: { paddingVertical: 14, paddingHorizontal: 4, justifyContent: 'center' },
  timeHeader: { flexBasis: 112, flexShrink: 0 },
  dayHeader: { flex: 1, minWidth: 0, alignItems: 'center' },
  timeCell: { flexBasis: 112, flexShrink: 0, minHeight: 68, borderRightWidth: 1, padding: 10, justifyContent: 'center' },
  permissionCell: { flex: 1, minWidth: 0, minHeight: 68, borderRightWidth: 1, padding: 6, justifyContent: 'center', alignItems: 'stretch' },
  permissionContent: { flex: 1, minHeight: 56, borderRadius: 16, padding: 7, justifyContent: 'center', position: 'relative' },
  permissionDetails: { gap: 4 },
  roomLine: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0 },
  roomIconBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  assignmentRows: { gap: 2, paddingLeft: 2 },
  assignmentLine: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 0 },
  permissionText: { flexShrink: 1, minWidth: 0 },
  cellActions: { position: 'absolute', top: 4, right: 4, zIndex: 2, flexDirection: 'row', justifyContent: 'center', gap: 3, borderRadius: 14, paddingHorizontal: 3, paddingVertical: 2 },
  actionButton: { width: 24, height: 24, margin: 0, padding: 0, borderWidth: 1, borderRadius: 12 },
  createButton: { alignSelf: 'center', width: 30, height: 30, margin: 0, borderRadius: 15 },
  strong: { fontWeight: '600' },
  dialog: { alignSelf: 'center', width: 640, maxWidth: '96%' },
  dialogContent: { minWidth: 540 },
});
