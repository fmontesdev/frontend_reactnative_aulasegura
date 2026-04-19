import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useDepartmentById, useUpdateDepartment } from '../../../../hooks/queries/useDepartments';
import { DepartmentForm } from '../../../../components/DepartmentForm';
import { DepartmentFormData } from '../../../../schemas/department.schema';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { ErrorState } from '../../../../components/ErrorState';

// Pantalla para editar un departamento existente
export default function EditDepartmentScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const departmentId = parseInt(id);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  // Obtener datos del departamento
  const { data: department, isLoading, error, refetch } = useDepartmentById(departmentId);
  const updateDepartment = useUpdateDepartment();

  const handleSubmit = async (data: Partial<DepartmentFormData>) => {
    if (!departmentId) return;

    try {
      await updateDepartment.mutateAsync({ departmentId, data });
      setSnackbarMessage('Departamento actualizado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al actualizar el departamento'
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
          Cargando departamento...
        </Text>
      </View>
    );
  }

  if (error || !department) {
    return <ErrorState message="Error al cargar el departamento" onRetry={refetch} />;
  }

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
            Editar Departamento
          </Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Modifica los datos del departamento{' '}
        </Text>
      </View>

      <DepartmentForm
        mode="edit"
        initialData={department}
        onSubmit={handleSubmit}
        isLoading={updateDepartment.isPending}
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
