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
import { UserCreateSchema, UserCreateFormData } from '../../schemas/user.schema';
import { User, RoleName } from '../../types/User';
import { isApiError } from '../../errors/ApiError';
import { styles } from './UserForm.styles';

interface CreateUserFormProps {
  onSubmit: (data: UserCreateFormData) => Promise<User | void>;
  isLoading?: boolean;
}

export function CreateUserForm({ onSubmit, isLoading = false }: CreateUserFormProps) {
  const theme = useAppTheme();
  const avatarPickerRef = useRef<AvatarPickerRef | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>([RoleName.TEACHER]);
  const [hasValidTo, setHasValidTo] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<UserCreateFormData>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      roles: [RoleName.TEACHER],
      avatar: 'avatar_default.png',
      validTo: null,
    },
  });

  const watchedRoles = watch('roles');

  useEffect(() => {
    if (watchedRoles) {
      setSelectedRoles(watchedRoles);
    }
  }, [watchedRoles]);

  const handleFormSubmit = async (data: UserCreateFormData) => {
    const selectedFile = avatarPickerRef.current?.selectedFile;
    const hasCustomAvatar = selectedFile && data.avatar === '__preview__';

    try {
      if (hasCustomAvatar) {
        data.avatar = 'avatar.png';
        const createdUser = await onSubmit(data);
        if (createdUser?.userId) {
          const uploadedAvatar = await avatarPickerRef.current?.uploadAvatar(createdUser.userId);
          if (!uploadedAvatar) {
            setSnackbarMessage('Usuario creado, pero no se pudo subir el avatar');
            setSnackbarVisible(true);
          }
        }
      } else {
        await onSubmit(data);
      }
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
            label="Contraseña"
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
            mode="create"
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
            control={control}
            errors={errors}
            selectedRoles={selectedRoles}
            onRolesChange={setSelectedRoles}
            setValue={setValue}
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
          icon="plus"
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={theme.colors.success}
        >
          Crear Usuario
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
