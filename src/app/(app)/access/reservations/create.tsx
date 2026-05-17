import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton, Text } from 'react-native-paper';
import { EventPermissionForm } from '../../../../components/EventPermissionForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useCreateEventPermission } from '../../../../hooks/queries/usePermissions';
import { EventPermissionFormData } from '../../../../schemas/access.schema';
import { useAppTheme } from '../../../../theme';

function combineDateAndTime(dateValue: string, timeValue: string) {
  const date = new Date(dateValue);
  const [hours, minutes] = timeValue.split(':').map(Number);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0,
  ).toISOString();
}

export default function CreateReservationScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createEventPermission = useCreateEventPermission();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: EventPermissionFormData) => {
    try {
      await createEventPermission.mutateAsync({
        roomId: data.roomId,
        description: data.description,
        startAt: combineDateAndTime(data.date, data.startTime),
        endAt: combineDateAndTime(data.date, data.endTime),
      });
      setSnackbarMessage('Reserva creada correctamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al crear la reserva');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Nueva reserva</Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>Completa los datos para crear tu reserva</Text>
      </View>

      <EventPermissionForm onSubmit={handleSubmit} isLoading={createEventPermission.isPending} />

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarType}
        action={{ label: 'Cerrar', onPress: () => setSnackbarVisible(false) }}
        duration={1500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 18, paddingBottom: 18 },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: -6, marginBottom: -2 },
  description: { paddingLeft: 8 },
});
