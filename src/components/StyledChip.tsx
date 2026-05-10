import React, { useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { Chip, Icon } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { addOpacity } from '../utils/colorUtils';

function CloseIcon({ defaultColor, hoverColor }: { defaultColor: string; hoverColor: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <View
      // @ts-ignore
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon source="close" size={18} color={hovered ? hoverColor : defaultColor} />
    </View>
  );
}

interface StyledChipProps {
  text?: string;
  children?: string;
  color?: string;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onClose?: () => void;
  onPress?: () => void;
}

// Chip con borderRadius, texto con estilos, y backgroundColor con opacidad
export function StyledChip({ 
  text,
  children,
  color,
  icon,
  style,
  textStyle,
  onClose,
  onPress,
}: StyledChipProps) {
  const theme = useAppTheme();


  const chipColor = color || theme.colors.primary;
  const displayText = text || children || '';

  return (
    <Chip
      mode="flat"
      compact
      icon={icon ? () => <Icon source={icon} size={14} color={chipColor} /> : undefined}
      onClose={onClose}
      closeIcon={() => <CloseIcon defaultColor={theme.colors.darkGrey} hoverColor={theme.colors.secondary} />}
      onPress={onPress}
      rippleColor={addOpacity(chipColor, 0.16)}
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
