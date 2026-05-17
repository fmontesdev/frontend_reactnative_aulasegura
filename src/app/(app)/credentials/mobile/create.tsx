import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { CredentialForm } from '../../../../components/Credentials/CredentialForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useCreateTag } from '../../../../hooks/queries/useTags';
import { useUsers } from '../../../../hooks/queries/useUsers';
import { MobileTagFormData } from '../../../../schemas/tag.schema';
import { useAppTheme } from '../../../../theme';
import { CreateTagResponse } from '../../../../types/Tag';
import { User } from '../../../../types/User';
import { addOpacity } from '../../../../utils/colorUtils';
import { isApiError } from '../../../../errors/ApiError';

export default function CreateMobileCredentialScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createTag = useCreateTag();
  const { data: usersResponse, isLoading: usersLoading } = useUsers({ limit: 100, filters: ['estado:activo'] });
  const [mobileCredential, setMobileCredential] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const userOptions = useMemo(() => (usersResponse?.data || []).map((user: User) => ({
    label: `${user.name} ${user.lastname} · ${user.email}`,
    value: user.userId,
  })), [usersResponse?.data]);

  const showMessage = (message: string, type: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleSubmit = async (data: MobileTagFormData) => {
    try {
      const result: CreateTagResponse = await createTag.mutateAsync({ userId: data.userId, type: 'nfc_mobile' });
      if (result.mobileCredential) {
        setMobileCredential(result.mobileCredential);
      }
      showMessage('NFC móvil creada correctamente', 'success');
    } catch (error: unknown) {
      showMessage(isApiError(error) ? error.message : 'Error al crear NFC móvil', 'error');
    }
  };

  const copyMobileCredential = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(mobileCredential);
      showMessage('Credencial copiada al portapapeles', 'success');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
            Nueva NFC móvil
          </Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Genera una credencial móvil para un usuario
        </Text>
      </View>

      {mobileCredential ? (
        <View style={[styles.onceCard, { borderColor: theme.colors.warning, backgroundColor: addOpacity(theme.colors.warning, 0.08) }]}> 
          <View style={styles.onceText}>
            <Text variant="titleMedium" style={{ color: theme.colors.warning }}>
              Esta credencial solo se muestra una vez
            </Text>
            <Text selectable variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {mobileCredential}
            </Text>
          </View>
          <View style={styles.onceActions}>
            <Button mode="outlined" onPress={copyMobileCredential}>
              Copiar
            </Button>
            <Button mode="contained" onPress={() => router.back()} buttonColor={theme.colors.success}>
              Volver
            </Button>
          </View>
        </View>
      ) : (
        <CredentialForm
          type="nfc_mobile"
          userOptions={userOptions}
          usersLoading={usersLoading}
          isLoading={createTag.isPending}
          onSubmit={(data) => handleSubmit(data as MobileTagFormData)}
        />
      )}

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarType}
        action={{ label: 'Cerrar', onPress: () => setSnackbarVisible(false) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 18, paddingBottom: 18 },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -6,
    marginBottom: -2,
  },
  description: { paddingLeft: 8 },
  onceCard: {
    width: '48%',
    minWidth: 280,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  onceText: { gap: 8 },
  onceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
