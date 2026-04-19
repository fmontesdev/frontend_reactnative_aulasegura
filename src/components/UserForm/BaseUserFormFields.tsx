import React from 'react';
import { View } from 'react-native';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { FormSegmentedButtons } from '../FormSegmentedButtons';
import { FormSingleSelect } from '../FormSingleSelect';
import { FormCheckbox } from '../FormCheckbox';
import { FormDatePicker } from '../FormDatePicker';
import { UserCreateFormData } from '../../schemas/user.schema';
import { RoleName } from '../../types/User';
import { useDepartments } from '../../hooks/queries/useDepartments';
import { getRoleLabel } from '../../utils/roleUtils';
import { styles } from './UserForm.styles';

interface BaseUserFormFieldsProps {
  control: Control<UserCreateFormData>;
  errors: FieldErrors<UserCreateFormData>;
  selectedRoles: RoleName[];
  onRolesChange: (roles: RoleName[]) => void;
  setValue: UseFormSetValue<UserCreateFormData>;
  hasValidTo: boolean;
  onToggleValidTo: () => void;
}

export function BaseUserFormFields({
  control,
  errors,
  selectedRoles,
  onRolesChange,
  setValue,
  hasValidTo,
  onToggleValidTo,
}: BaseUserFormFieldsProps) {
  const { data: departments, isLoading: departmentsLoading } = useDepartments();

  return (
    <>
      <FormSegmentedButtons
        control={control}
        name="roles"
        label="Roles"
        errors={errors}
        options={Object.values(RoleName).map((role) => ({
          value: role,
          label: getRoleLabel(role),
        }))}
        multiSelect
        onValueChange={(newValue) => {
          if (!Array.isArray(newValue) || !newValue.includes(RoleName.TEACHER)) {
            setValue('departmentId', undefined);
          }
          if (Array.isArray(newValue)) {
            onRolesChange(newValue as RoleName[]);
          }
        }}
      />

      {selectedRoles.includes(RoleName.TEACHER) && (
        <View style={styles.departmentSection}>
          <FormSingleSelect
            control={control}
            name="departmentId"
            label="Departamento"
            errors={errors}
            options={
              departments
                ?.filter((dept) => dept.isActive)
                .map((dept) => ({
                  value: dept.departmentId,
                  label: dept.name,
                })) || []
            }
            isLoading={departmentsLoading}
            loadingText="Cargando departamentos..."
            emptyText="No hay departamentos disponibles"
          />
        </View>
      )}

      <View style={styles.validToSection}>
        <FormCheckbox
          label="Establecer fecha de fin de actividad"
          checked={hasValidTo}
          onPress={onToggleValidTo}
        />
        {hasValidTo && (
          <FormDatePicker
            control={control}
            name="validTo"
            label="Fecha de fin"
            errors={errors}
          />
        )}
      </View>
    </>
  );
}
