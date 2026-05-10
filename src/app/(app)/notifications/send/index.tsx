import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SendNotificationForm } from '../../../../components/NotificationForm/SendNotificationForm';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';
import { useCreateNotification } from '../../../../hooks/queries/useNotifications';
import { useAppTheme } from '../../../../theme';
import { CreateNotificationData } from '../../../../types/Notification';

export default function SendNotificationScreen() {
  const theme = useAppTheme();
  const createNotification = useCreateNotification();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: CreateNotificationData) => {
    try {
      const response = await createNotification.mutateAsync(data);
      setSnackbarMessage(`Notificación enviada a ${response.createdRecipients} destinatario${response.createdRecipients === 1 ? '' : 's'}`);
      setSnackbarType('success');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al enviar la notificación');
      setSnackbarType('error');
      setSnackbarVisible(true);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
          Enviar notificación
        </Text>
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.grey }]}> 
          Crea una notificación manual para un usuario, un rol o todos los usuarios activos
        </Text>
      </View>

      <SendNotificationForm
        onSubmit={handleSubmit}
        isLoading={createNotification.isPending}
      />

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarType}
        action={{ label: 'Cerrar', onPress: () => setSnackbarVisible(false) }}
        duration={2000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 2,
  },
  header: {
    paddingBottom: 18,
  },
  description: {
    marginTop: 4,
  },
});
