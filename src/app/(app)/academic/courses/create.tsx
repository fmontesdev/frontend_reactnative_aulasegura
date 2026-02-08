import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useCreateCourse } from '../../../../hooks/queries/useCourses';
import { CourseForm } from '../../../../components/CourseForm';
import { CourseFormData } from '../../../../schemas/course.schema';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';

// Pantalla para crear un nuevo curso
export default function CreateCourseScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createCourse = useCreateCourse();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: CourseFormData) => {
    try {
      await createCourse.mutateAsync(data);
      setSnackbarMessage('Curso creado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      // Navegar de vuelta después de un breve delay para mostrar el snackbar
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al crear el curso'
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
            Nuevo Curso
          </Text>
        </View>
        <Text variant="bodyMedium" style={[ styles.description,{ color: theme.colors.grey }]}>
          Completa los datos para crear un nuevo curso
        </Text>
      </View>

      <CourseForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createCourse.isPending}
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
