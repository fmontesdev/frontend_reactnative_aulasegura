import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { RoomForm } from '../../../../components/RoomForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useCreateRoom } from '../../../../hooks/queries/useRooms';
import { CreateRoomData, UpdateRoomData } from '../../../../types/Room';

export default function CreateRoomScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createRoom = useCreateRoom();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: CreateRoomData | UpdateRoomData) => {
    try {
      const createdRoom = await createRoom.mutateAsync(data as CreateRoomData);
      setSnackbarMessage('Aula creada exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
      return createdRoom;
    } catch (error: unknown) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al crear el aula');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Nueva Aula</Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Completa los datos para crear una nueva aula
        </Text>
      </View>

      <RoomForm mode="create" onSubmit={handleSubmit} isLoading={createRoom.isPending} />

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
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -6,
    marginBottom: -2,
  },
  description: { paddingLeft: 8 },
});
