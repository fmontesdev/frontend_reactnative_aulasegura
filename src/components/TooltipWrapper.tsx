import React, { useRef, useState } from 'react';
import { View, ViewStyle, Platform, StyleSheet } from 'react-native';
import { Text, Portal } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { addOpacity } from '../utils/colorUtils';

interface TooltipWrapperProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
  multiline?: boolean;
  placement?: 'top' | 'bottom';
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  title,
  children,
  style,
  multiline = false,
  placement = 'top',
}) => {
  const theme = useAppTheme();
  const ref = useRef<View>(null); // Referencia al contenedor para posicionar el tooltip
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null); // Posición del tooltip

  if (Platform.OS === 'web') {
    return (
      <View
        ref={ref}
        style={styles.container}
        // @ts-ignore
        onMouseEnter={() => {
          const rect = (ref.current as any).getBoundingClientRect();
          setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
        }}
        onMouseLeave={() => setTooltipPos(null)}
      >
        {children}

        {/* Utilizamos Portal para renderizar el tooltip fuera del flujo normal del DOM */}
        {tooltipPos && (
          <Portal>
            <Text style={[
              styles.tooltip,
              multiline && styles.tooltipMultiline,
              placement === 'bottom' && styles.tooltipBottom,
              { left: tooltipPos.x, top: tooltipPos.y },
              { backgroundColor: addOpacity(theme.colors.superlightGrey, 0.94) },
              { color: theme.colors.grey },
              { boxShadow: '0 2px 2px rgba(0,0,0,0.20)' },
            ]}>
              {title}
            </Text>
          </Portal>
        )}
      </View>
    );
  }

  return <View style={style}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'fixed' as any,
    // Centra horizontalmente y desplaza encima del elemento
    transform: 'translateX(-50%) translateY(-110%)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    zIndex: 9999,
    pointerEvents: 'none',
    // @ts-ignore
    whiteSpace: 'nowrap',
  },
  tooltipMultiline: {
    maxWidth: 320,
    // @ts-ignore
    whiteSpace: 'pre-line',
    lineHeight: 18,
  },
  tooltipBottom: {
    transform: 'translateX(-50%) translateY(36px)',
  },
});
