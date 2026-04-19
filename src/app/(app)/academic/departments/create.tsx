import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useCreateDepartment } from '../../../../hooks/queries/useDepartments';
import { DepartmentForm } from '../../../../components/DepartmentForm';
import { DepartmentFormData } from '../../../../schemas/department.schema';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';

// Pantalla para crear un nuevo departamento
export default function CreateDepartmentScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createDepartment = useCreateDepartment();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: DepartmentFormData) => {
    try {
      await createDepartment.mutateAsync(data);
      setSnackbarMessage('Departamento creado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      // Navegar de vuelta después de un breve delay para mostrar el snackbar
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al crear el departamento'
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
            Nuevo Departamento
          </Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Completa los datos para crear un nuevo departamento
        </Text>
      </View>

      <DepartmentForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createDepartment.isPending}
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
