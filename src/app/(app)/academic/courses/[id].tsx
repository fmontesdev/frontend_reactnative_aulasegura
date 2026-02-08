import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useCourse, useUpdateCourse } from '../../../../hooks/queries/useCourses';
import { CourseForm } from '../../../../components/CourseForm';
import { CourseFormData } from '../../../../schemas/course.schema';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';

// Pantalla para editar un curso existente
export default function EditCourseScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const courseId = parseInt(id);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  // Obtener datos del curso
  const { data: course, isLoading, error, refetch } = useCourse(courseId);
  const updateCourse = useUpdateCourse();

  const handleSubmit = async (data: Partial<CourseFormData>) => {
    if (!courseId) return;
    
    try {
      // Asegurar que academicYearCode esté presente
      const updateData = {
        ...data,
        academicYearCode: data.academicYearCode || course?.academicYears[0].code || '2025-2026',
      };
      await updateCourse.mutateAsync({ courseId, data: updateData });
      setSnackbarMessage('Curso actualizado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al actualizar el curso'
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
          Cargando curso...
        </Text>
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Error al cargar el curso
        </Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurface }}>
          {error instanceof Error ? error.message : 'El curso no existe'}
        </Text>
      </View>
    );
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
            Editar Curso
          </Text>
        </View>
        <Text variant="bodyMedium" style={[ styles.description,{ color: theme.colors.grey }]}>
          Modifica los datos del curso{' '}
        </Text>
      </View>

      <CourseForm
        mode="edit"
        initialData={course}
        onSubmit={handleSubmit}
        isLoading={updateCourse.isPending}
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
