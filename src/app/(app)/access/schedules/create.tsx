import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton, Text } from 'react-native-paper';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { WeeklyScheduleForm } from '../../../../components/WeeklyScheduleForm';
import { useCreateWeeklySchedule } from '../../../../hooks/queries/useSchedules';
import { WeeklyScheduleFormData } from '../../../../schemas/access.schema';
import { useAppTheme } from '../../../../theme';

export default function CreateScheduleScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createWeeklySchedule = useCreateWeeklySchedule();
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; variant: 'success' | 'error' }>({
    visible: false,
    message: '',
    variant: 'success',
  });

  const handleSubmit = async (data: WeeklyScheduleFormData) => {
    try {
      await createWeeklySchedule.mutateAsync({
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      setSnackbar({ visible: true, message: 'Horario creado correctamente', variant: 'success' });
      setTimeout(() => router.back(), 1500);
    } catch (caughtError) {
      setSnackbar({ visible: true, message: caughtError instanceof Error ? caughtError.message : 'Error al crear el horario', variant: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Nuevo horario</Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>Completa los datos para crear un horario semanal</Text>
      </View>

      <WeeklyScheduleForm mode="create" onSubmit={handleSubmit} isLoading={createWeeklySchedule.isPending} />

      <StyledSnackbar visible={snackbar.visible} onDismiss={() => setSnackbar((current) => ({ ...current, visible: false }))} message={snackbar.message} variant={snackbar.variant} duration={1500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 18, paddingBottom: 18 },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: -6, marginBottom: -2 },
  description: { paddingLeft: 8 },
});
