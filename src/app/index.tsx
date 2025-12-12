import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

/**
 * Ruta raíz de la aplicación
 * Verifica autenticación y redirige a /home o /login
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Muestra loader mientras verifica autenticación inicial
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirige según estado de autenticación
  return <Redirect href={isAuthenticated ? '/home' : '/login'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
