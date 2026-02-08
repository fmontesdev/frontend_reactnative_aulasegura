import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../theme';
import { UserForm } from '../../../components/UserForm';
import { StyledSnackbar } from '../../../components/StyledSnackbar';
import { useCreateUser } from '../../../hooks/queries/useUsers';
import { UserCreateFormData } from '../../../schemas/user.schema';

// Pantalla para crear un nuevo usuario
export default function CreateUserScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createUser = useCreateUser();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: UserCreateFormData) => {
    try {
      const newUser = await createUser.mutateAsync(data);
      setSnackbarMessage('Curso creado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      // Navegar de vuelta después de un breve delay para mostrar el snackbar
      setTimeout(() => router.back(), 1500);
      return newUser;
    } catch (error: any) {
      setSnackbarMessage(
        error instanceof Error ? error.message : 'Error al crear el usuario'
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
      throw error; // Re-lanza para UserForm
    }
  };

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
            Nuevo Usuario
          </Text>
        </View>
        <Text variant="bodyMedium" style={[ styles.description,{ color: theme.colors.grey }]}>
          Completa los datos para crear un nuevo usuario
        </Text>
      </View>

      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createUser.isPending}
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
