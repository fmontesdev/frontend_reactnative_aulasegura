import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { ReaderForm } from '../../../../components/ReaderForm';
import { ErrorState } from '../../../../components/ErrorState';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useReader, useUpdateReader } from '../../../../hooks/queries/useReaders';
import { CreateReaderData, UpdateReaderData } from '../../../../types/Reader';

export default function EditReaderScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const readerId = parseInt(id, 10);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const { data: reader, isLoading, error, refetch } = useReader(readerId);
  const updateReader = useUpdateReader();

  const handleSubmit = async (data: CreateReaderData | UpdateReaderData) => {
    if (!readerId) return;

    try {
      await updateReader.mutateAsync({ readerId, data: data as UpdateReaderData });
      setSnackbarMessage('Lector actualizado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al actualizar el lector');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.secondary }}>
          Cargando lector...
        </Text>
      </View>
    );
  }

  if (error || !reader) {
    return <ErrorState message="Error al cargar el lector" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Editar Lector</Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Modifica los datos del lector
        </Text>
      </View>

      <ReaderForm mode="edit" initialData={reader} onSubmit={handleSubmit} isLoading={updateReader.isPending} />

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
