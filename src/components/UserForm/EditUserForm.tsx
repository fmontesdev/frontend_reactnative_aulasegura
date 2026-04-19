import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AvatarPicker, AvatarPickerRef } from '../AvatarPicker';
import { StyledSnackbar } from '../StyledSnackbar';
import { BaseUserFormFields } from './BaseUserFormFields';
import { FormTextInput } from '../FormTextInput';
import { useAppTheme } from '../../theme';
import { UserEditSchema, UserEditFormData, UserCreateFormData } from '../../schemas/user.schema';
import { User, RoleName } from '../../types/User';
import { isApiError } from '../../errors/ApiError';
import { getChangedFields } from '../../utils/formUtils';
import { styles } from './UserForm.styles';

interface EditUserFormProps {
  onSubmit: (data: Partial<UserEditFormData>) => Promise<User | void>;
  isLoading?: boolean;
  initialData: User;
}

export function EditUserForm({ onSubmit, isLoading = false, initialData }: EditUserFormProps) {
  const theme = useAppTheme();
  const avatarPickerRef = useRef<AvatarPickerRef | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>(
    initialData.roles || [RoleName.TEACHER]
  );
  const [hasValidTo, setHasValidTo] = useState(!!initialData.validTo);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<UserEditFormData>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      name: initialData.name,
      lastname: initialData.lastname,
      email: initialData.email,
      password: '',
      roles: initialData.roles,
      avatar: initialData.avatar,
      departmentId: initialData.department?.departmentId,
      validTo: initialData.validTo ?? null,
    },
  });

  const watchedRoles = watch('roles');

  useEffect(() => {
    if (watchedRoles) {
      setSelectedRoles(watchedRoles);
    }
  }, [watchedRoles]);

  const handleFormSubmit = async (data: UserEditFormData) => {
    const selectedFile = avatarPickerRef.current?.selectedFile;
    const hasCustomAvatar = selectedFile && data.avatar === '__preview__';

    try {
      if (hasCustomAvatar) {
        const uploadedAvatar = await avatarPickerRef.current?.uploadAvatar(initialData.userId);
        if (!uploadedAvatar) return;
        data.avatar = uploadedAvatar;
      }

      const { password, ...rest } = data;
      const normalizedInitial: Record<string, unknown> = {
        name: initialData.name,
        lastname: initialData.lastname,
        email: initialData.email,
        avatar: initialData.avatar,
        roles: initialData.roles,
        departmentId: initialData.department?.departmentId,
        validTo: initialData.validTo ?? null,
      };
      const changedFields = getChangedFields(
        rest as unknown as Record<string, unknown>,
        normalizedInitial,
      ) as Partial<UserEditFormData>;
      if (password && password !== '') {
        changedFields.password = password;
      }
      await onSubmit(changedFields);
    } catch (e: unknown) {
      const msg = isApiError(e) ? e.message : 'Error inesperado al guardar';
      setSnackbarMessage(msg);
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Primera sección: Datos personales */}
      <View style={styles.formGrid}>
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="name"
            label="Nombre"
            errors={errors}
          />
        </View>

        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="lastname"
            label="Apellidos"
            errors={errors}
          />
        </View>

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

        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="password"
            label="Contraseña (dejar vacía para no cambiar)"
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
            mode="edit"
            initialAvatar={initialData.avatar}
            userId={initialData.userId}
            disabled={isLoading}
            errors={errors}
            onUploadError={(message) => {
              setSnackbarMessage(message);
              setSnackbarVisible(true);
            }}
          />
        </View>

        {/* Configuración - Derecha */}
        <View style={styles.configColumn}>
          <BaseUserFormFields
            control={control as unknown as import('react-hook-form').Control<UserCreateFormData>}
            errors={errors as import('react-hook-form').FieldErrors<UserCreateFormData>}
            selectedRoles={selectedRoles}
            onRolesChange={setSelectedRoles}
            setValue={setValue as unknown as import('react-hook-form').UseFormSetValue<UserCreateFormData>}
            hasValidTo={hasValidTo}
            onToggleValidTo={() => {
              const next = !hasValidTo;
              setHasValidTo(next);
              if (!next) setValue('validTo', null);
            }}
          />
        </View>
      </View>

      {/* Botón Submit */}
      <View style={styles.submitButtonContainer}>
        <Button
          icon="pencil"
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={theme.colors.tertiary}
        >
          Actualizar Usuario
        </Button>
      </View>

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant="error"
        action={{
          label: 'Cerrar',
          onPress: () => setSnackbarVisible(false),
        }}
      />
    </ScrollView>
  );
}
