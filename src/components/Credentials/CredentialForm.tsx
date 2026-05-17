import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSingleSelect, SingleSelectOption } from '../FormSingleSelect';
import { FormTextInput } from '../FormTextInput';
import { useAppTheme } from '../../theme';
import {
  MobileTagFormData,
  MobileTagFormSchema,
  PhysicalTagFormData,
  PhysicalTagFormSchema,
} from '../../schemas/tag.schema';
import { TagType } from '../../types/Tag';
import { addOpacity } from '../../utils/colorUtils';

interface CredentialFormProps {
  type: TagType;
  userOptions: SingleSelectOption[];
  usersLoading: boolean;
  isLoading: boolean;
  onSubmit: (data: PhysicalTagFormData | MobileTagFormData) => Promise<void>;
}

interface CredentialFormBaseProps extends Omit<CredentialFormProps, 'type'> {}

function PhysicalCredentialForm({ userOptions, usersLoading, isLoading, onSubmit }: CredentialFormBaseProps) {
  const theme = useAppTheme();
  const { control, handleSubmit, formState: { errors } } = useForm<PhysicalTagFormData>({
    resolver: zodResolver(PhysicalTagFormSchema),
    defaultValues: { userId: '', rawUid: '' },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGrid}>
        <View style={styles.formGridItem}>
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
        </View>

        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="rawUid"
            label="UID físico"
            errors={errors}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          icon="plus"
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={theme.colors.success}
        >
          Crear NFC física
        </Button>
      </View>
    </ScrollView>
  );
}

function MobileCredentialForm({ userOptions, usersLoading, isLoading, onSubmit }: CredentialFormBaseProps) {
  const theme = useAppTheme();
  const { control, handleSubmit, formState: { errors } } = useForm<MobileTagFormData>({
    resolver: zodResolver(MobileTagFormSchema),
    defaultValues: { userId: '' },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.leftColumn}>
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

        <View style={[styles.infoCard, { borderColor: theme.colors.warning, backgroundColor: addOpacity(theme.colors.warning, 0.08) }]}> 
          <Text variant="titleSmall" style={{ color: theme.colors.warning }}>
            Credencial generada automáticamente
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            La credencial móvil se generará automáticamente y solo se mostrará una vez tras crearla.
          </Text>
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          icon="plus"
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={theme.colors.success}
        >
          Crear NFC móvil
        </Button>
      </View>
    </ScrollView>
  );
}

export function CredentialForm({ type, ...props }: CredentialFormProps) {
  return type === 'rfid' ? <PhysicalCredentialForm {...props} /> : <MobileCredentialForm {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 20,
    rowGap: 12,
  },
  formGridItem: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 280,
  },
  leftColumn: {
    width: '48%',
    minWidth: 280,
    gap: 12,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  submitButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 30,
    marginBottom: 32,
  },
});
