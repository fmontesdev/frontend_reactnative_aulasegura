import React, { useState } from 'react';
import { View, ViewStyle, Platform, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { addOpacity } from '../utils/colorUtils';

interface TooltipWrapperProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ title, children, style }) => {
  const theme = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View
        style={styles.container}
        // @ts-ignore - onMouseEnter y onMouseLeave son válidos en web
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        <Text variant="labelSmall" style={[
          styles.tooltip,
          {backgroundColor: addOpacity(theme.colors.quinary, 0.95)},
          {color: theme.colors.secondary},
          {opacity: isHovered ? 1 : 0},
          {transform: 'translateX(-60%) translateY(-8px)'},
          {boxShadow: '0 2px 3px rgba(0,0,0,0.25)'},
        ]}>
          {title}
        </Text>
      </View>
    );
  }
  
  // En mobile, solo retornar el children sin tooltip
  return <View style={style}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    zIndex: 9999,
    pointerEvents: 'none',
  },
});