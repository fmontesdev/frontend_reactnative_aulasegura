import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useSubject, useUpdateSubject } from '../../../../hooks/queries/useSubjects';
import { SubjectForm } from '../../../../components/SubjectForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { SubjectFormData } from '../../../../schemas/subject.schema';

// Pantalla para editar una asignatura existente
export default function EditSubjectScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subjectId = parseInt(id);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  // Obtener datos de la asignatura
  const { data: subject, isLoading, error } = useSubject(subjectId);
  const updateSubject = useUpdateSubject();

  const handleSubmit = async (data: SubjectFormData) => {
    if (!subjectId) return;

    try {
      await updateSubject.mutateAsync({ subjectId, data});
      setSnackbarMessage('Asignatura actualizada exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      // Navegar de vuelta después de un breve delay para mostrar el snackbar
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al actualizar la asignatura'
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.secondary }}>
          Cargando asignatura...
        </Text>
      </View>
    );
  }

  if (error || !subject) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Error al cargar la asignatura
        </Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurface }}>
          {error instanceof Error ? error.message : 'La asignatura no existe'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton
            icon="arrow-left"
            size={22}
            onPress={() => router.back()}
            iconColor={theme.colors.secondary}
          />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
            Editar Asignatura
          </Text>
        </View>
        <Text variant="bodyMedium" style={[ styles.description,{ color: theme.colors.grey }]}>
          Modifica los datos de la asignatura{' '}
        </Text>
      </View>

      <SubjectForm
        mode="edit"
        initialData={subject}
        onSubmit={handleSubmit}
        isLoading={updateSubject.isPending}
      />

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarType}
        action={{
          label: 'Cerrar',
          onPress: () => setSnackbarVisible(false),
        }}
        duration={1500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -6,
    marginBottom: -2,
  },
  description: {
    paddingLeft: 8,
  },
});
