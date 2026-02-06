import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Chip } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { addOpacity } from '../utils/colorUtils';

type ChipVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface StyledChipProps {
  text?: string;
  children?: string;
  color?: string;
  variant?: ChipVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onClose?: () => void;
}

// Chip con borderRadius, texto con estilos, y backgroundColor con opacidad
export function StyledChip({ 
  text, 
  children, 
  color, 
  variant = 'default',
  style, 
  textStyle,
  onClose,
}: StyledChipProps) {
  const theme = useAppTheme();
  
  // Determinar el color según la variante
  const getVariantColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.tertiary;
      default:
        return theme.colors.grey;
    }
  };

  const chipColor = getVariantColor();
  const displayText = text || children || '';

  return (
    <Chip
      mode="flat"
      compact
      onClose={onClose}
      closeIcon="close"
      style={[
        styles.chip,
        { backgroundColor: addOpacity(chipColor, 0.12) },
        style,
      ]}
      textStyle={[
        styles.text,
        theme.fonts.labelSmall,
        { color: chipColor },
        textStyle,
      ]}
    >
      {displayText}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
  },
  text: {
    marginVertical: 5,
  }
});
