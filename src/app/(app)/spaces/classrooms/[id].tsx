import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { RoomForm } from '../../../../components/RoomForm';
import { ErrorState } from '../../../../components/ErrorState';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useRoom, useUpdateRoom } from '../../../../hooks/queries/useRooms';
import { CreateRoomData, UpdateRoomData } from '../../../../types/Room';

export default function EditRoomScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = parseInt(id, 10);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const { data: room, isLoading, error, refetch } = useRoom(roomId);
  const updateRoom = useUpdateRoom();

  const handleSubmit = async (data: CreateRoomData | UpdateRoomData) => {
    if (!roomId) return;

    try {
      const updatedRoom = await updateRoom.mutateAsync({ roomId, data: data as UpdateRoomData });
      setSnackbarMessage('Aula actualizada exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
      return updatedRoom;
    } catch (error: unknown) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al actualizar el aula');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.secondary }}>
          Cargando aula...
        </Text>
      </View>
    );
  }

  if (error || !room) {
    return <ErrorState message="Error al cargar el aula" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Editar Aula</Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Modifica los datos del aula
        </Text>
      </View>

      <RoomForm mode="edit" initialData={room} onSubmit={handleSubmit} isLoading={updateRoom.isPending} />

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
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 18, paddingBottom: 18 },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -6,
    marginBottom: -2,
  },
  description: { paddingLeft: 8 },
});
