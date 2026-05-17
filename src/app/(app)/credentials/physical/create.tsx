import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { CredentialForm } from '../../../../components/Credentials/CredentialForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useCreateTag } from '../../../../hooks/queries/useTags';
import { useUsers } from '../../../../hooks/queries/useUsers';
import { PhysicalTagFormData } from '../../../../schemas/tag.schema';
import { useAppTheme } from '../../../../theme';
import { User } from '../../../../types/User';
import { isApiError } from '../../../../errors/ApiError';

export default function CreatePhysicalCredentialScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createTag = useCreateTag();
  const { data: usersResponse, isLoading: usersLoading } = useUsers({ limit: 100, filters: ['estado:activo'] });
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

  const handleSubmit = async (data: PhysicalTagFormData) => {
    try {
      await createTag.mutateAsync({ userId: data.userId, type: 'rfid', rawUid: data.rawUid });
      showMessage('NFC física creada correctamente', 'success');
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      showMessage(isApiError(error) ? error.message : 'Error al crear NFC física', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <IconButton icon="arrow-left" size={22} onPress={() => router.back()} iconColor={theme.colors.secondary} />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
            Nueva NFC física
          </Text>
        </View>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}>
          Asocia una tarjeta o llave NFC física a un usuario
        </Text>
      </View>

      <CredentialForm
        type="rfid"
        userOptions={userOptions}
        usersLoading={usersLoading}
        isLoading={createTag.isPending}
        onSubmit={(data) => handleSubmit(data as PhysicalTagFormData)}
      />

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarType}
        action={{ label: 'Cerrar', onPress: () => setSnackbarVisible(false) }}
        duration={1500}
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
});
