/**
 * Componente de formulario para crear/editar departamentos
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from '../FormTextInput';
import { useAppTheme } from '../../theme';
import { DepartmentFormSchema, DepartmentFormData } from '../../schemas/department.schema';
import { Department } from '../../types/Department';
import { getChangedFields } from '../../utils/formUtils';
import { styles } from './DepartmentForm.styles';

interface DepartmentFormProps {
  mode: 'create' | 'edit';
  initialData?: Department;
  onSubmit: (data: DepartmentFormData) => Promise<Department | void>;
  isLoading?: boolean;
}

export function DepartmentForm({ mode, initialData, onSubmit, isLoading = false }: DepartmentFormProps) {
  const theme = useAppTheme();

  // Validación y manejo del formulario con React Hook Form y Zod
  const { control, handleSubmit, formState: { errors } } = useForm<DepartmentFormData>({
    resolver: zodResolver(DepartmentFormSchema),
    defaultValues: mode === 'edit' && initialData
      ? {
          name: initialData.name,
        }
      : {
          name: '',
        }
  });

  // Función principal de submit
  const handleFormSubmit = async (data: DepartmentFormData) => {
    if (mode === 'edit' && initialData) {
      const normalizedInitial: Record<string, unknown> = {
        name: initialData.name,
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

  const buttonLabel = mode === 'create' ? 'Crear Departamento' : 'Actualizar Departamento';

  return (
    <ScrollView style={styles.container}>
      {/* Formulario */}
      <View style={styles.formGrid}>
        {/* TextInput Nombre */}
        <View style={[styles.formGridItem, { flexGrow: 0 }]}>
          <FormTextInput
            control={control}
            name="name"
            label="Nombre"
            errors={errors}
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
