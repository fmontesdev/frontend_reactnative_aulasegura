import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { TeacherAssignmentForm } from '../../../../components/TeacherAssignmentForm';
import { TeacherAssignmentFormData } from '../../../../schemas/teacherAssignment.schema';
import { useCreateTeacherAssignment } from '../../../../hooks/queries/useTeacherAssignments';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';

export default function CreateTeacherAssignmentScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createAssignment = useCreateTeacherAssignment();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: TeacherAssignmentFormData) => {
    try {
      await createAssignment.mutateAsync(data);
      setSnackbarMessage('Asignación creada exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al crear la asignación');
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
            Nueva Asignación
          </Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Selecciona profesor, curso y asignatura
        </Text>
      </View>

      <TeacherAssignmentForm
        onSubmit={handleSubmit}
        isLoading={createAssignment.isPending}
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
