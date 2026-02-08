import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, IconButton } from 'react-native-paper';
import { useAppTheme } from '../../../theme';
import { UserForm } from '../../../components/UserForm';
import { StyledSnackbar } from '../../../components/StyledSnackbar';
import { useUser, useUpdateUser } from '../../../hooks/queries/useUsers';
import { UserEditFormData } from '../../../schemas/user.schema';

// Pantalla para editar un usuario existente
export default function EditUserScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  
  // Obtener datos del usuario
  const { data: user, isLoading, error } = useUser(id);
  const updateUser = useUpdateUser();

  const handleSubmit = async (data: UserEditFormData) => {
    if (!id) return;

    try {
      await updateUser.mutateAsync({ userId: id, data });
      setSnackbarMessage('Usuario actualizado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      // Navegar de vuelta después de un breve delay para mostrar el snackbar
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al actualizar el usuario'
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.secondary }}>
          Cargando usuario...
        </Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Error al cargar el usuario
        </Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurface }}>
          {error instanceof Error ? error.message : 'El usuario no existe'}
        </Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <IconButton
              icon="arrow-left"
              size={22}
              onPress={() => router.back()}
              iconColor={theme.colors.secondary}
            />
            <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
              Editar Usuario
            </Text>
          </View>
        <Text variant="bodyMedium" style={[ styles.description,{ color: theme.colors.grey }]}>
          Modifica los datos del usuario{' '}
        </Text>
        </View>

        <UserForm
          mode="edit"
          initialData={user}
          onSubmit={handleSubmit}
          isLoading={updateUser.isPending}
        />

        <StyledSnackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          message={snackbarMessage}
          variant="error"
          action={{
            label: 'Cerrar',
            onPress: () => setSnackbarVisible(false),
          }}
          duration={1500}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: -6,
    paddingBottom: 18,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -6,
    marginBottom: -2,
  },
  description: {
    paddingLeft: 8,
  },
});
