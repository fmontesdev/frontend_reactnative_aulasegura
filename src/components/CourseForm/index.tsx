/**
 * Componente de formulario para crear/editar cursos
 */

import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from '../FormTextInput';
import { FormSegmentedButtons } from '../FormSegmentedButtons';
import { useAppTheme } from '../../theme';
import { CourseFormSchema, CourseFormData } from '../../schemas/course.schema';
import { Course, EducationStage, CFLevel } from '../../types/Course';
import { CURRENT_ACADEMIC_YEAR } from '../../constants';
import { getChangedFields } from '../../utils/formUtils';
import { styles } from './CourseForm.styles';

interface CourseFormProps {
  mode: 'create' | 'edit';
  initialData?: Course;
  onSubmit: (data: CourseFormData) => Promise<Course | void>;
  isLoading?: boolean;
}

const EDUCATION_STAGES = [
  { value: EducationStage.ESO, label: 'ESO' },
  { value: EducationStage.BACHILLERATO, label: 'Bachillerato' },
  { value: EducationStage.CF, label: 'Ciclos Formativos' },
];

const CF_LEVELS = [
  { value: CFLevel.FPB, label: 'FP Básica' },
  { value: CFLevel.CFGM, label: 'Grado Medio' },
  { value: CFLevel.CFGS, label: 'Grado Superior' },
];

const LEVELS_ESO = [
  { value: 1, label: '1º' },
  { value: 2, label: '2º' },
  { value: 3, label: '3º' },
  { value: 4, label: '4º' },
];

const LEVELS_OTHER = [
  { value: 1, label: '1º' },
  { value: 2, label: '2º' },
];

export function CourseForm({ mode, initialData, onSubmit, isLoading = false }: CourseFormProps) {
  const theme = useAppTheme();

  // Validación y manejo del formulario con React Hook Form y Zod
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: mode === 'edit' && initialData
      ? {
          courseCode: initialData.courseCode,
          name: initialData.name,
          educationStage: initialData.educationStage,
          levelNumber: initialData.levelNumber,
          cfLevel: initialData.cfLevel,
          academicYearCode: initialData.academicYears[0]?.code || CURRENT_ACADEMIC_YEAR,
        }
      : {
          courseCode: '',
          name: '',
          educationStage: EducationStage.ESO,
          levelNumber: 1,
          cfLevel: null,
          academicYearCode: CURRENT_ACADEMIC_YEAR,
        }
  });

  const watchedEducationStage = watch('educationStage');

  // Obtener los niveles disponibles según la etapa educativa
  const availableLevels = watchedEducationStage === EducationStage.ESO ? LEVELS_ESO : LEVELS_OTHER;

  // Ajustar nivel al máximo permitido al cambiar de etapa educativa
  useEffect(() => {
    const currentLevel = watch('levelNumber');
    const maxLevel = watchedEducationStage === EducationStage.ESO ? 4 : 2;
    
    if (currentLevel > maxLevel) {
      setValue('levelNumber', maxLevel);
    }
  }, [watchedEducationStage, watch, setValue]);

  // Limpiar cfLevel cuando la etapa educativa no es CF
  useEffect(() => {
    if (watchedEducationStage !== EducationStage.CF) {
      setValue('cfLevel', null);
    } else if (watch('cfLevel') === null) {
      setValue('cfLevel', CFLevel.FPB);
    }
  }, [watchedEducationStage, setValue, watch]);

  // Función principal de submit
  const handleFormSubmit = async (data: CourseFormData) => {
    if (mode === 'edit' && initialData) {
      const normalizedInitial: Record<string, unknown> = {
        courseCode: initialData.courseCode,
        name: initialData.name,
        educationStage: initialData.educationStage,
        levelNumber: initialData.levelNumber,
        cfLevel: initialData.cfLevel,
        academicYearCode: initialData.academicYears[0]?.code,
      };
      const changedFields = getChangedFields(
        data as unknown as Record<string, unknown>,
        normalizedInitial,
      );
      await onSubmit(changedFields as any);
    } else {
      await onSubmit(data as any);
    }
  };

  const buttonLabel = mode === 'create' ? 'Crear Curso' : 'Actualizar Curso';

  return (
    <ScrollView style={styles.container}>
      {/* Formulario en dos columnas */}
      <View style={styles.formGrid}>
        {/* TextInput Código */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="courseCode"
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

        {/* Selector para Etapa educativa */}
        <View style={styles.formGridItem}>
          <FormSegmentedButtons
            control={control}
            name="educationStage"
            label="Etapa educativa"
            errors={errors}
            options={EDUCATION_STAGES}
          />
        </View>

        {/* Selector para Nivel */}
        <View style={styles.formGridItem}>
          <FormSegmentedButtons
            control={control}
            name="levelNumber"
            label="Nivel"
            errors={errors}
            options={availableLevels}
          />
        </View>

        {/* Selector para Nivel Ciclo Formativo (solo si es CF) */}
        {watchedEducationStage === EducationStage.CF && (
          <View style={styles.formGridItemLeft}>
            <FormSegmentedButtons
              control={control}
              name="cfLevel"
              label="Nivel Ciclo Formativo"
              errors={errors}
              options={CF_LEVELS}
            />
          </View>
        )}
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
