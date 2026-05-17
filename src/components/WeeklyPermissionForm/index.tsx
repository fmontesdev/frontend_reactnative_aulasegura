import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Text } from 'react-native-paper';
import { FormSingleSelect } from '../FormSingleSelect';
import { useRooms } from '../../hooks/queries/useRooms';
import { useTeacherAssignments } from '../../hooks/queries/useTeacherAssignments';
import { WeeklyPermissionFormData, WeeklyPermissionFormSchema } from '../../schemas/access.schema';
import { useAppTheme } from '../../theme';
import { PermissionResponse } from '../../types/Permission';
import { ScheduleResponse } from '../../types/Schedule';
import { User } from '../../types/User';

interface WeeklyPermissionFormProps {
  mode: 'create' | 'edit';
  user: User;
  schedule: ScheduleResponse;
  isTeacher: boolean;
  initialData?: PermissionResponse;
  onSubmit: (data: WeeklyPermissionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function formatSchedule(schedule: ScheduleResponse) {
  const weekly = schedule.weeklySchedule;
  return weekly ? `${weekly.startTime.slice(0, 5)} - ${weekly.endTime.slice(0, 5)}` : 'Horario semanal';
}

function formatAssignmentLabel(assignment: { course: { name: string; courseCode: string }; subject: { name: string; subjectCode: string } }) {
  return `${assignment.course.name} - ${assignment.subject.name}`;
}

export function WeeklyPermissionForm({
  mode,
  user,
  schedule,
  isTeacher,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: WeeklyPermissionFormProps) {
  const theme = useAppTheme();
  const { data: roomsResponse, isLoading: roomsLoading } = useRooms({ limit: 100 });
  const { data: assignmentsResponse, isLoading: assignmentsLoading } = useTeacherAssignments(
    { limit: 100, filters: [`teacherId:${user.userId}`] },
    isTeacher,
  );

  const defaultValues = useMemo(() => ({
    roomId: initialData?.roomId ?? initialData?.room?.roomId ?? 0,
    assignmentId: initialData?.assignment?.assignmentId ?? null,
  }), [initialData?.assignment?.assignmentId, initialData?.room?.roomId, initialData?.roomId]);

  const { control, handleSubmit, reset, setError, formState: { errors } } = useForm<WeeklyPermissionFormData>({
    resolver: zodResolver(WeeklyPermissionFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const roomOptions = useMemo(() => [
    { value: 0, label: 'Selecciona aula' },
    ...(roomsResponse?.data ?? []).map((room) => ({ value: room.roomId, label: `${room.name} ${room.roomCode}` })),
  ], [roomsResponse?.data]);

  const assignmentOptions = useMemo(() => [
    { value: 0, label: 'Selecciona asignación' },
    ...(assignmentsResponse?.data ?? [])
      .filter((assignment) => assignment.isActive)
      .map((assignment) => ({
        value: assignment.assignmentId,
        label: formatAssignmentLabel(assignment),
        courseLabel: assignment.course.name,
        subjectLabel: assignment.subject.name,
      })),
  ], [assignmentsResponse?.data]);

  const handleFormSubmit = async (data: WeeklyPermissionFormData) => {
    if (isTeacher && !data.assignmentId) {
      setError('assignmentId', { type: 'manual', message: 'Selecciona una asignación' });
      return;
    }

    await onSubmit({
      roomId: data.roomId,
      assignmentId: isTeacher ? data.assignmentId : null,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contextBox}>
        <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
          {user.name} {user.lastname} · {formatSchedule(schedule)}
        </Text>
      </View>

      <View style={styles.formColumn}>
        <FormSingleSelect
          control={control}
          name="roomId"
          label="Aula"
          errors={errors}
          options={roomOptions}
          isLoading={roomsLoading}
          emptyText="No hay aulas disponibles"
          disabled={isLoading}
        />

        {isTeacher ? (
          <FormSingleSelect
            control={control}
            name="assignmentId"
            label="Asignación docente"
            errors={errors}
            options={assignmentOptions}
            isLoading={assignmentsLoading}
            loadingText="Cargando asignaciones..."
            emptyText="Este profesor no tiene asignaciones activas"
            disabled={isLoading}
            menuStyle={styles.assignmentMenu}
          />
        ) : null}
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          disabled={isLoading}
          textColor={theme.colors.tertiary}
          contentStyle={styles.dialogButton}
          labelStyle={styles.dialogButtonLabel}
        >
          Cancelar
        </Button>
        <Button
          icon={mode === 'create' ? 'plus' : 'pencil'}
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={mode === 'create' ? theme.colors.success : theme.colors.tertiary}
          contentStyle={styles.dialogButton}
        >
          {mode === 'create' ? 'Crear' : 'Guardar'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contextBox: { paddingHorizontal: 8, paddingBottom: 12 },
  formColumn: { gap: 16, padding: 8 },
  assignmentMenu: { width: 560, maxWidth: '100%' },
  submitButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 8, paddingVertical: 16 },
  dialogButton: { paddingHorizontal: 10 },
  dialogButtonLabel: { marginVertical: 9 },
});
