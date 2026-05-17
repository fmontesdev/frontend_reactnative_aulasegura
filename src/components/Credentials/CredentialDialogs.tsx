import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, HelperText, Portal, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSingleSelect, SingleSelectOption } from '../FormSingleSelect';
import { FormTextInput } from '../FormTextInput';
import { MobileTagFormData, MobileTagFormSchema, PhysicalTagFormData, PhysicalTagFormSchema, RegenerateTagFormData, RegenerateTagFormSchema } from '../../schemas/tag.schema';
import { TagType } from '../../types/Tag';

interface CreateCredentialDialogProps {
  visible: boolean;
  type: TagType;
  userOptions: SingleSelectOption[];
  usersLoading: boolean;
  isLoading: boolean;
  onDismiss: () => void;
  onSubmit: (data: PhysicalTagFormData | MobileTagFormData) => Promise<void>;
}

export function CreateCredentialDialog({
  visible,
  type,
  userOptions,
  usersLoading,
  isLoading,
  onDismiss,
  onSubmit,
}: CreateCredentialDialogProps) {
  const isPhysical = type === 'rfid';
  const schema = isPhysical ? PhysicalTagFormSchema : MobileTagFormSchema;
  const { control, handleSubmit, reset, formState: { errors } } = useForm<PhysicalTagFormData | MobileTagFormData>({
    resolver: zodResolver(schema),
    defaultValues: isPhysical ? { userId: '', rawUid: '' } : { userId: '' },
  });

  const handleClose = () => {
    reset(isPhysical ? { userId: '', rawUid: '' } : { userId: '' });
    onDismiss();
  };

  const handleValidSubmit = async (data: PhysicalTagFormData | MobileTagFormData) => {
    await onSubmit(data);
    reset(isPhysical ? { userId: '', rawUid: '' } : { userId: '' });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleClose} style={styles.dialog}>
        <Dialog.Title>{isPhysical ? 'Crear NFC física' : 'Crear NFC móvil'}</Dialog.Title>
        <Dialog.Content>
          <View style={styles.form}>
            <FormSingleSelect
              control={control}
              name="userId"
              label="Usuario"
              errors={errors}
              options={userOptions}
              isLoading={usersLoading}
              loadingText="Cargando usuarios..."
              emptyText="No hay usuarios disponibles"
            />
            {isPhysical ? (
              <FormTextInput
                control={control}
                name="rawUid"
                label="UID físico"
                errors={errors}
                autoCapitalize="characters"
              />
            ) : (
              <Text variant="bodySmall">La credencial móvil se generará automáticamente y solo se mostrará una vez.</Text>
            )}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleClose} disabled={isLoading}>Cancelar</Button>
          <Button mode="contained" onPress={handleSubmit(handleValidSubmit)} loading={isLoading} disabled={isLoading}>
            Crear
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

interface RegenerateCredentialDialogProps {
  visible: boolean;
  credentialLabel: string;
  isLoading: boolean;
  onDismiss: () => void;
  onSubmit: (data: RegenerateTagFormData) => Promise<void>;
}

export function RegenerateCredentialDialog({
  visible,
  credentialLabel,
  isLoading,
  onDismiss,
  onSubmit,
}: RegenerateCredentialDialogProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<RegenerateTagFormData>({
    resolver: zodResolver(RegenerateTagFormSchema),
    defaultValues: { rawUid: '' },
  });

  const handleClose = () => {
    reset({ rawUid: '' });
    onDismiss();
  };

  const handleValidSubmit = async (data: RegenerateTagFormData) => {
    await onSubmit(data);
    reset({ rawUid: '' });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleClose} style={styles.dialog}>
        <Dialog.Title>Regenerar NFC física</Dialog.Title>
        <Dialog.Content>
          <View style={styles.form}>
            <Text variant="bodyMedium">Introduce el nuevo UID para {credentialLabel}.</Text>
            <FormTextInput
              control={control}
              name="rawUid"
              label="Nuevo UID físico"
              errors={errors}
              autoCapitalize="characters"
            />
            {errors.rawUid ? <HelperText type="error">{errors.rawUid.message}</HelperText> : null}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleClose} disabled={isLoading}>Cancelar</Button>
          <Button mode="contained" onPress={handleSubmit(handleValidSubmit)} loading={isLoading} disabled={isLoading}>
            Regenerar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
  },
  form: {
    gap: 14,
  },
});
