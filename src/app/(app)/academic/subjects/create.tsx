import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useCreateSubject } from '../../../../hooks/queries/useSubjects';
import { SubjectForm } from '../../../../components/SubjectForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { SubjectFormData } from '../../../../schemas/subject.schema';

// Pantalla para crear una nueva asignatura
export default function CreateSubjectScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createSubject = useCreateSubject();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: SubjectFormData) => {
    try {
      await createSubject.mutateAsync(data);
      setSnackbarMessage('Asignatura creada exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      // Navegar de vuelta después de un breve delay para mostrar el snackbar
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al crear la asignatura'
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton
            icon="arrow-left"
            size={22}
            onPress={() => router.back()}
            iconColor={theme.colors.secondary}
          />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
            Nueva Asignatura
          </Text>
        </View>
        <Text variant="bodyMedium" style={[ styles.description,{ color: theme.colors.grey }]}>
          Completa los datos para crear una nueva asignatura
        </Text>
      </View>

      <SubjectForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createSubject.isPending}
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
