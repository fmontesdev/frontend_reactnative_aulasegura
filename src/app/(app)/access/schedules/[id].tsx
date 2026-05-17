import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { ErrorState } from '../../../../components/ErrorState';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { WeeklyScheduleForm } from '../../../../components/WeeklyScheduleForm';
import { useSchedule, useUpdateWeeklySchedule } from '../../../../hooks/queries/useSchedules';
import { WeeklyScheduleFormData } from '../../../../schemas/access.schema';
import { useAppTheme } from '../../../../theme';

export default function EditScheduleScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheduleId = Number(id);
  const { data: schedule, isLoading, error, refetch } = useSchedule(scheduleId);
  const updateWeeklySchedule = useUpdateWeeklySchedule();
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; variant: 'success' | 'error' }>({
    visible: false,
    message: '',
    variant: 'success',
  });

  const handleSubmit = async (data: Partial<WeeklyScheduleFormData>) => {
    try {
      await updateWeeklySchedule.mutateAsync({ scheduleId, data });
      setSnackbar({ visible: true, message: 'Horario actualizado correctamente', variant: 'success' });
      setTimeout(() => router.back(), 1500);
    } catch (caughtError) {
      setSnackbar({ visible: true, message: caughtError instanceof Error ? caughtError.message : 'Error al actualizar el horario', variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Cargando horario...</Text>
      </View>
    );
  }

  if (error || !schedule?.weeklySchedule) {
    return <ErrorState message="Error al cargar el horario" onRetry={refetch} />;
  }

  const initialData = {
    dayOfWeek: schedule.weeklySchedule.dayOfWeek,
    startTime: schedule.weeklySchedule.startTime,
    endTime: schedule.weeklySchedule.endTime,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Editar horario</Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>Modifica los datos del horario semanal</Text>
      </View>

      <WeeklyScheduleForm mode="edit" initialData={initialData} onSubmit={handleSubmit} isLoading={updateWeeklySchedule.isPending} />

      <StyledSnackbar visible={snackbar.visible} onDismiss={() => setSnackbar((current) => ({ ...current, visible: false }))} message={snackbar.message} variant={snackbar.variant} duration={1500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16 },
  header: { paddingTop: 18, paddingBottom: 18 },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: -6, marginBottom: -2 },
  description: { paddingLeft: 8 },
});
