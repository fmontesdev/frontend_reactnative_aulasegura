import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, HelperText, Portal, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from '../FormTextInput';
import { RegenerateTagFormData, RegenerateTagFormSchema } from '../../schemas/tag.schema';
import { useAppTheme } from '../../theme';

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
  const theme = useAppTheme();
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
      <Dialog visible={visible} onDismiss={handleClose} style={[styles.dialog, { backgroundColor: theme.colors.surface }]}> 
        <Dialog.Title style={{ color: theme.colors.secondary }}>Regenerar NFC física</Dialog.Title>
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
          <Button mode="outlined" textColor={theme.colors.tertiary} contentStyle={styles.dialogButton} labelStyle={styles.dialogButtonLabel} onPress={handleClose} disabled={isLoading}>Cancelar</Button>
          <Button mode="contained" buttonColor={theme.colors.tertiary} contentStyle={styles.dialogButton} labelStyle={styles.dialogButtonLabel} onPress={handleSubmit(handleValidSubmit)} loading={isLoading} disabled={isLoading}>
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
  dialogButton: {
    paddingHorizontal: 12,
  },
  dialogButtonLabel: {
    marginVertical: 9,
  },
});
