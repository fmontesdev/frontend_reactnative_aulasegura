import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from '../FormTextInput';
import { FormSegmentedButtons } from '../FormSegmentedButtons';
import { FormSingleSelect } from '../FormSingleSelect';
import { FormCheckbox } from '../FormCheckbox';
import { FormDatePicker } from '../FormDatePicker';
import { AvatarPicker, AvatarPickerRef } from '../AvatarPicker';
import { StyledSnackbar } from '../StyledSnackbar';
import { useAppTheme } from '../../theme';
import { UserCreateSchema, UserEditSchema, UserCreateFormData, UserEditFormData } from '../../schemas/user.schema';
import { User, RoleName } from '../../types/User';
import { useDepartments } from '../../hooks/queries/useDepartments';
import { getRoleLabel } from '../../utils/roleUtils';
import { styles } from './UserForm.styles';
import { isApiError } from '../../errors/ApiError';

interface UserFormProps {
  mode: 'create' | 'edit';
  initialData?: User;
  onSubmit: (data: UserCreateFormData | UserEditFormData) => Promise<User | void>;
  isLoading?: boolean;
}

export function UserForm({ mode, initialData, onSubmit, isLoading = false }: UserFormProps) {
  const theme = useAppTheme();
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>(initialData?.roles || [RoleName.TEACHER]);
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState<'warning' | 'error'>('warning');
  const [hasValidTo, setHasValidTo] = useState(!!initialData?.validTo);
  const avatarPickerRef = useRef<AvatarPickerRef | null>(null);
  const isSubmitting = isLoading;

  // Validación y manejo del formulario con React Hook Form y Zod
  const {control, handleSubmit, watch, setValue, formState: { errors }} = useForm<
    typeof mode extends 'create' ? UserCreateFormData : UserEditFormData
  >({
    resolver: zodResolver(mode === 'create' ? UserCreateSchema : UserEditSchema),
  defaultValues : mode === 'edit' && initialData
    ? {
        name: initialData.name,
        lastname: initialData.lastname,
        email: initialData.email,
        password: '',
        roles: initialData.roles,
        avatar: initialData.avatar,
        departmentId: initialData.department?.departmentId,
        validTo: initialData.validTo ?? null,
      }
    : {
        name: '',
        lastname: '',
        email: '',
        password: '',
        roles: [RoleName.TEACHER],
        avatar: 'avatar_default.png',
        validTo: null,
      }
  });

  const watchedRoles = watch('roles');

  // Actualizar selectedRoles cuando cambia en el formulario
  useEffect(() => {
    if (watchedRoles) {
      setSelectedRoles(watchedRoles);
    }
  }, [watchedRoles]);

  // Obtener solo los campos modificados en modo edición
  const getChangedFields = (data: UserEditFormData): Partial<UserEditFormData> => {
    if (!initialData) return data;
    
    const changedFields: Partial<UserEditFormData> = {};
    
    if (data.name !== initialData.name) changedFields.name = data.name;
    if (data.lastname !== initialData.lastname) changedFields.lastname = data.lastname;
    if (data.email !== initialData.email) changedFields.email = data.email;
    if (data.password && data.password !== '') changedFields.password = data.password;
    if (data.avatar !== initialData.avatar) changedFields.avatar = data.avatar;
    
    const rolesChanged = JSON.stringify(data.roles.sort()) !== JSON.stringify(initialData.roles.sort());
    if (rolesChanged) changedFields.roles = data.roles;
    
    if (data.departmentId !== initialData.department?.departmentId) {
      changedFields.departmentId = data.departmentId;
    }
    
    if (data.validTo !== initialData.validTo) {
      changedFields.validTo = data.validTo;
    }
    
    return changedFields;
  };

  // Función principal de submit
  const handleFormSubmit = async (data: UserCreateFormData | UserEditFormData) => {
    const selectedFile = avatarPickerRef.current?.selectedFile;
    const hasCustomAvatar = selectedFile && data.avatar === '__preview__';

    try {
      if (mode === 'edit' && initialData) {
        // MODO EDIT: Subir avatar primero si hay archivo pendiente
        if (hasCustomAvatar) {
          const uploadedAvatar = await avatarPickerRef.current?.uploadAvatar(initialData.userId);
          if (!uploadedAvatar) return; // Error al subir, no continuar
          data.avatar = uploadedAvatar;
        }
        
        const changedFields = getChangedFields(data as UserEditFormData);
        await onSubmit(changedFields as UserEditFormData);
      } else {
        // MODO CREATE
        if (hasCustomAvatar) {
          // Crear usuario con avatar predeterminado
          data.avatar = 'avatar.png';
          const createdUser = await onSubmit(data);
          
          // Subir avatar personalizado (no bloqueante)
          if (createdUser?.userId) {
            const uploadedAvatar = await avatarPickerRef.current?.uploadAvatar(createdUser.userId);
            if (!uploadedAvatar) {
              setSnackbarMessage('Usuario creado, pero no se pudo subir el avatar');
              setSnackbarVisible(true);
            }
          }
        } else {
          // Sin avatar personalizado
          await onSubmit(data);
        }
      }
    } catch (e: unknown) {
      const msg = isApiError(e) ? e.message : 'Error inesperado al guardar';
      setSnackbarMessage(msg);
      setSnackbarVariant('error');
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Primera sección: Datos personales */}
      <View style={styles.formGrid}>
        {/* TextInput Nombre */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="name"
            label="Nombre"
            errors={errors}
          />
        </View>

        {/* TextInput Apellidos */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="lastname"
            label="Apellidos"
            errors={errors}
          />
        </View>

        {/* TextInputEmail */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            errors={errors}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* TextInput Contraseña */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="password"
            label={mode === 'create' ? 'Contraseña' : 'Contraseña (dejar vacía para no cambiar)'}
            errors={errors}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Segunda sección: Avatar y configuración */}
      <View style={styles.secondSection}>
        {/* Avatar - Izquierda */}
        <View style={styles.avatarColumn}>
          <AvatarPicker
            ref={avatarPickerRef}
            control={control}
            name="avatar"
            mode={mode}
            initialAvatar={initialData?.avatar}
            userId={initialData?.userId}
            disabled={isSubmitting}
            errors={errors}
            onUploadError={(message) => {
              setSnackbarMessage(message);
              setSnackbarVisible(true);
            }}
          />
        </View>

        {/* Configuración - Derecha */}
        <View style={styles.configColumn}>
          {/* Selector para Roles */}
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
              // Limpiar departmentId si no hay teacher en los roles
              if (!Array.isArray(newValue) || !newValue.includes(RoleName.TEACHER)) {
                setValue('departmentId', undefined);
              }
            }}
          />

          {/* Select de Departamentos (solo para profesores) */}
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

          {/* Fecha de fin de actividad */}
          <View style={styles.validToSection}>
            <FormCheckbox
              label="Establecer fecha de fin de actividad"
              checked={hasValidTo}
              onPress={() => {
                const newValue = !hasValidTo;
                setHasValidTo(newValue);
                if (!newValue) {
                  setValue('validTo', null);
                }
              }}
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
        </View>
      </View>

      {/* Botón Submit */}
      <View style={styles.submitButtonContainer}>
        <Button
          icon={mode === 'create' ? 'plus' : 'pencil'}
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          buttonColor={mode === 'create' ? theme.colors.success : theme.colors.tertiary}
        >
          {mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
        </Button>
      </View>

      {/* Snackbar para errores */}
      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarVariant}
        action={{
          label: 'Cerrar',
          onPress: () => setSnackbarVisible(false),
        }}
      />
    </ScrollView>
  );
}
