import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from 'react-native-paper';
import { useAppTheme } from '../theme';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState = ({ message = 'Error al cargar los datos', onRetry }: ErrorStateProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Icon source="alert-circle-outline" size={48} color={theme.colors.error} />
      <Text variant="bodyLarge" style={{ marginTop: 12, color: theme.colors.error }}>
        {message}
      </Text>
      <Button mode="outlined" onPress={onRetry} icon="refresh" style={{ marginTop: 16 }}>
        Reintentar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
