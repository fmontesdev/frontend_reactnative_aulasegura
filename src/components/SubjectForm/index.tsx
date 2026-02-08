/**
 * Componente de formulario para crear/editar asignaturas
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from '../FormTextInput';
import { FormSingleSelect } from '../FormSingleSelect';
import { FormMultiSelect } from '../FormMultiSelect';
import { useAppTheme } from '../../theme';
import { SubjectFormSchema, SubjectFormData } from '../../schemas/subject.schema';
import { Subject } from '../../types/Subject';
import { Department } from '../../types/Department';
import { Course } from '../../types/Course';
import { useDepartments } from '../../hooks/queries/useDepartments';
import { useCourses } from '../../hooks/queries/useCourses';
import { styles } from './SubjectForm.styles';

interface SubjectFormProps {
  mode: 'create' | 'edit';
  initialData?: Subject;
  onSubmit: (data: SubjectFormData) => Promise<Subject | void>;
  isLoading?: boolean;
}

export function SubjectForm({ mode, initialData, onSubmit, isLoading = false }: SubjectFormProps) {
  const theme = useAppTheme();
  const { data: departments = [], isLoading: departmentsLoading } = useDepartments();
  const { data: coursesResponse, isLoading: coursesLoading } = useCourses({ limit: 100 });

  const courses = coursesResponse?.data || [];

  // Validación y manejo del formulario con React Hook Form y Zod
  const { control, handleSubmit, formState: { errors } } = useForm<SubjectFormData>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: mode === 'edit' && initialData
      ? {
          subjectCode: initialData.subjectCode,
          name: initialData.name,
          departmentId: initialData.department.departmentId,
          courseIds: initialData.courses.map(c => c.courseId),
        }
      : {
          subjectCode: '',
          name: '',
          departmentId: undefined,
          courseIds: [],
        }
  });

  // Obtener solo los campos modificados en modo edición
  const getChangedFields = (data: SubjectFormData): Partial<SubjectFormData> => {
    if (!initialData) return data;

    const changedFields: Partial<SubjectFormData> = {};

    if (data.subjectCode !== initialData.subjectCode) changedFields.subjectCode = data.subjectCode;
    if (data.name !== initialData.name) changedFields.name = data.name;
    if (data.departmentId !== initialData.department.departmentId) changedFields.departmentId = data.departmentId;
    
    const currentCourseIds = initialData.courses.map(c => c.courseId).sort();
    const newCourseIds = data.courseIds.sort();
    if (JSON.stringify(currentCourseIds) !== JSON.stringify(newCourseIds)) {
      changedFields.courseIds = data.courseIds;
    }

    return changedFields;
  };

  // Función principal de submit
  const handleFormSubmit = async (data: SubjectFormData) => {
    if (mode === 'edit' && initialData) {
      const changedFields = getChangedFields(data);
      await onSubmit(changedFields as any);
    } else {
      await onSubmit(data as any);
    }
  };

  const buttonLabel = mode === 'create' ? 'Crear Asignatura' : 'Actualizar Asignatura';

  return (
    <ScrollView style={styles.container}>
      {/* Formulario en dos columnas */}
      <View style={styles.formGrid}>
        {/* TextInput Código */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="subjectCode"
            label="Código único"
            errors={errors}
          />
        </View>

        {/* TextInput Nombre */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="name"
            label="Nombre"
            errors={errors}
          />
        </View>

        {/* Selector de Departamento */}
        <View style={styles.formGridItem}>
          <FormSingleSelect
            control={control}
            name="departmentId"
            label="Departamento"
            errors={errors}
            options={departments.map((dept: Department) => ({
              label: dept.name,
              value: dept.departmentId,
            }))}
            isLoading={departmentsLoading}
            loadingText="Cargando departamentos..."
            emptyText="No hay departamentos disponibles"
          />
        </View>

        {/* Selector de Cursos (multi-select) */}
        <View style={styles.formGridItem}>
          <FormMultiSelect
            control={control}
            name="courseIds"
            label="Cursos"
            errors={errors}
            options={courses.map((course: Course) => ({
              label: `${course.name} (${course.courseCode})`,
              value: course.courseId,
            }))}
            isLoading={coursesLoading}
            loadingText="Cargando cursos..."
            emptyText="No hay cursos disponibles"
          />
        </View>
      </View>

      {/* Botón Submit */}
      <View style={styles.submitButtonContainer}>
        <Button
          icon={mode === 'create' ? 'plus' : 'pencil'}
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={mode === 'create' ? theme.colors.success : theme.colors.tertiary}
        >
          {buttonLabel}
        </Button>
      </View>
    </ScrollView>
  );
}
