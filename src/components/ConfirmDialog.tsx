import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Text, Button } from 'react-native-paper';
import { useAppTheme } from '../theme';

interface ConfirmDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  highlightedText?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  message,
  highlightedText,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  variant = 'danger',
}) => {
  const theme = useAppTheme();

  // Determina los colores del diálogo según la variante
  const getColors = () => {
    switch (variant) {
      case 'danger':
        return {
          title: theme.colors.error,
          confirmButton: theme.colors.error,
          confirmText: theme.colors.onError,
        };
      case 'warning':
        return {
          title: theme.colors.warning,
          confirmButton: theme.colors.warning,
          confirmText: theme.colors.onWarning,
        };
      case 'info':
        return {
          title: theme.colors.tertiary,
          confirmButton: theme.colors.tertiary,
          confirmText: theme.colors.onTertiary,
        };
      case 'success':
        return {
          title: theme.colors.success,
          confirmButton: theme.colors.success,
          confirmText: theme.colors.onSuccess,
        };
      default:
        return {
          title: theme.colors.tertiary,
          confirmButton: theme.colors.tertiary,
          confirmText: theme.colors.onTertiary,
        };
    }
  };

  const colors = getColors();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={{ color: colors.title }}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge">
            {message}{' '}
            {highlightedText && (
              <Text style={{ fontWeight: '700', color: theme.colors.secondary }}>
                {highlightedText}
              </Text>
            )}
            ?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={onDismiss}
            buttonColor={theme.colors.tertiary}
            textColor={theme.colors.onTertiary}
            contentStyle={styles.dialogButton}
          >
            {cancelText}
          </Button>
          <Button
            onPress={onConfirm}
            loading={isLoading}
            disabled={isLoading}
            buttonColor={colors.confirmButton}
            textColor={colors.confirmText}
            contentStyle={styles.dialogButton}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    alignSelf: 'center',
  },
  dialogButton: {
    paddingHorizontal: 10,
  },
});
