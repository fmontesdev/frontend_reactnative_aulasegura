import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../theme';
import { useRouter } from 'expo-router';
import { API_CONFIG } from '../../constants';

export default function HomeScreen() {
  const theme = useAppTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const avatarUrl = user?.avatar 
    ? `${API_CONFIG.IMAGE_SERVER_URL}/${user.avatar}`
    : undefined;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Bienvenido a AulaSegura
        </Text>

        {/* Avatar del usuario */}
        {avatarUrl && (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}

        {/* Información del usuario */}
        <View style={styles.userInfo}>
          <Text variant="headlineSmall" style={{ color: theme.colors.secondary }}>
            {user?.name} {user?.lastname}
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.grey }}>
            {user?.email}
          </Text>
          
          {user?.department && (
            <Text variant="bodyMedium" style={{ color: theme.colors.grey, marginTop: 8 }}>
              Departamento: {user.department.name}
            </Text>
          )}

          {user?.roles && user.roles.length > 0 && (
            <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
              Rol: {user.roles.join(', ')}
            </Text>
          )}
        </View>

        {/* Botón de cerrar sesión */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          contentStyle={styles.buttonContent}
        >
          Cerrar Sesión
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  button: {
    marginTop: 16,
    minWidth: 200,
    borderRadius: 40,

  },
  buttonContent: {
    paddingVertical: 0,
  },
});
