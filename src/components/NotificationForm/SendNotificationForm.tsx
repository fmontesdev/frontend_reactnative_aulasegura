import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSegmentedButtons } from '../FormSegmentedButtons';
import { FormSingleSelect } from '../FormSingleSelect';
import { FormTextInput } from '../FormTextInput';
import { useUsers } from '../../hooks/queries/useUsers';
import { useAppTheme } from '../../theme';
import { NotificationCreateFormData, NotificationCreateSchema } from '../../schemas/notification.schema';
import { CreateNotificationData, NotificationTargetMode, NotificationType } from '../../types/Notification';
import { RoleName } from '../../types/User';
import { getRoleLabel } from '../../utils/roleUtils';
import { styles as userFormStyles } from '../UserForm/UserForm.styles';

interface SendNotificationFormProps {
  onSubmit: (data: CreateNotificationData) => Promise<void>;
  isLoading?: boolean;
}

export function SendNotificationForm({ onSubmit, isLoading = false }: SendNotificationFormProps) {
  const theme = useAppTheme();
  const { data: usersResponse, isLoading: usersLoading } = useUsers({
    page: 1,
    limit: 50,
    filters: ['estado:activo'],
  });
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<NotificationCreateFormData>({
    resolver: zodResolver(NotificationCreateSchema),
    defaultValues: {
      type: 'warning',
      title: '',
      body: '',
      target: { mode: 'all' },
    },
  });
  const targetMode = watch('target.mode');

  const handleTargetModeChange = (mode: NotificationTargetMode | NotificationTargetMode[]) => {
    if (Array.isArray(mode)) return;

    if (mode === 'user') setValue('target', { mode: 'user', userId: '' });
    if (mode === 'role') setValue('target', { mode: 'role', roleName: RoleName.TEACHER });
    if (mode === 'all') setValue('target', { mode: 'all' });
  };

  const handleFormSubmit = async (data: NotificationCreateFormData) => {
    await onSubmit({
      type: data.type,
      title: data.title.trim(),
      body: data.body.trim(),
      target: data.target,
    });
  };

  return (
    <ScrollView style={userFormStyles.container}>
      <View style={userFormStyles.secondSection}>
        <View style={userFormStyles.avatarColumn}>
          <View style={styles.contentColumn}>
            <FormSegmentedButtons<NotificationCreateFormData, NotificationType>
              control={control}
              name="type"
              label="Tipo"
              errors={errors}
              options={[
                { value: 'access', label: 'Acceso' },
                { value: 'warning', label: 'Aviso' },
                { value: 'info', label: 'Información' },
              ]}
            />

            <View>
              <FormTextInput
                control={control}
                name="title"
                label="Título"
                errors={errors}
              />
            </View>

            <View>
              <FormTextInput
                control={control}
                name="body"
                label="Mensaje"
                errors={errors}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        <View style={userFormStyles.configColumn}>
          <View>
            <FormSegmentedButtons<NotificationCreateFormData, NotificationTargetMode>
              control={control}
              name="target.mode"
              label="Destinatarios"
              errors={errors}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'role', label: 'Rol' },
                { value: 'user', label: 'Usuario' },
              ]}
              onValueChange={handleTargetModeChange}
            />
          </View>

          {targetMode === 'user' ? (
            <View style={styles.configFieldSpacing}>
              <FormSingleSelect
                control={control}
                name="target.userId"
                label="Usuario"
                errors={errors}
                options={(usersResponse?.data ?? []).map((user) => ({
                  value: user.userId,
                  label: `${user.name} ${user.lastname} · ${user.email}`,
                }))}
                isLoading={usersLoading}
                loadingText="Cargando usuarios..."
                emptyText="No hay usuarios activos disponibles"
              />
            </View>
          ) : null}

          {targetMode === 'role' ? (
            <View style={styles.configFieldSpacing}>
              <FormSingleSelect
                control={control}
                name="target.roleName"
                label="Rol"
                errors={errors}
                options={Object.values(RoleName).map((role) => ({
                  value: role,
                  label: getRoleLabel(role),
                }))}
              />
            </View>
          ) : null}

          {targetMode === 'all' ? (
            <View style={styles.allRecipientsInfo}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey, textAlign: 'center' }}>
                La notificación se enviará a todos los usuarios activos.
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={userFormStyles.submitButtonContainer}>
        <Button
          icon="send"
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={theme.colors.success}
        >
          Enviar notificación
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentColumn: {
    gap: 12,
  },
  configFieldSpacing: {
    marginTop: 12,
  },
  allRecipientsInfo: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
