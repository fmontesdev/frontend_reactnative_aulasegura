import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useAppTheme } from '../../theme';

export interface QuickSegmentedFilterOption {
  label: string;
  value: string;
}

interface QuickSegmentedFilterGroupProps {
  options: QuickSegmentedFilterOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  buttonStyle?: StyleProp<ViewStyle>;
}

export function QuickSegmentedFilterGroup({
  options,
  selectedValue,
  onSelect,
  buttonStyle,
}: QuickSegmentedFilterGroupProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={selectedValue || ''}
        onValueChange={onSelect}
        buttons={options.map((option) => ({
          value: option.value,
          label: option.label,
          checkedColor: theme.colors.onTertiary,
          uncheckedColor: theme.colors.onSurfaceVariant,
          rippleColor: theme.colors.secondaryContainer,
          style: [
            styles.segmentButton,
            buttonStyle,
            selectedValue === option.value ? { backgroundColor: theme.colors.tertiary } : undefined,
          ],
          labelStyle: styles.segmentLabel,
        }))}
        density="small"
        style={[styles.segmentedButtons, { backgroundColor: theme.colors.onTertiary }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  segmentedButtons: {
    borderRadius: 20,
  },
  segmentButton: {
    minHeight: 30,
  },
  segmentLabel: {
    fontSize: 11,
    lineHeight: 14,
    marginVertical: 2,
    marginHorizontal: 1,
  },
});
