import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { ReaderForm } from '../../../../components/ReaderForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useCreateReader } from '../../../../hooks/queries/useReaders';
import { CreateReaderData, UpdateReaderData } from '../../../../types/Reader';

export default function CreateReaderScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createReader = useCreateReader();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: CreateReaderData | UpdateReaderData) => {
    try {
      await createReader.mutateAsync(data as CreateReaderData);
      setSnackbarMessage('Lector creado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al crear el lector');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Nuevo Lector</Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Completa los datos para crear un nuevo lector
        </Text>
      </View>

      <ReaderForm mode="create" onSubmit={handleSubmit} isLoading={createReader.isPending} />

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
