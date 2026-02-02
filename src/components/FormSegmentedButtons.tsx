import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, SegmentedButtons, HelperText } from 'react-native-paper';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useAppTheme } from '../theme';

export interface SegmentedButtonOption<T = string> {
  value: T;
  label: string;
}

interface FormSegmentedButtonsProps<TForm extends FieldValues, TValue = string> {
  control: Control<TForm>;
  name: Path<TForm>;
  label: string;
  errors: FieldErrors<TForm>;
  options: SegmentedButtonOption<TValue>[];
  multiSelect?: boolean;
  onValueChange?: (value: TValue | TValue[]) => void;
}

export function FormSegmentedButtons<TForm extends FieldValues, TValue = string>({
  control,
  name,
  label,
  errors,
  options,
  multiSelect = false,
  onValueChange,
}: FormSegmentedButtonsProps<TForm, TValue>) {
  const theme = useAppTheme();
  const error = errors[name];

  return (
    <View>
      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value as any}
            onValueChange={(newValue: string | string[]) => {
              onChange(newValue);
              onValueChange?.(newValue as any);
            }}
            multiSelect={multiSelect}
            buttons={options.map((option) => ({
              value: option.value as string,
              label: option.label,
              checkedColor: theme.colors.onTertiary,
              uncheckedColor: theme.colors.onSurfaceVariant,
              rippleColor: theme.colors.secondaryContainer,
              style: multiSelect
                ? (value as any[])?.includes(option.value)
                  ? { backgroundColor: theme.colors.tertiary }
                  : undefined
                : value === option.value
                ? { backgroundColor: theme.colors.tertiary }
                : undefined,
            }))}
            style={[styles.segmentedButtons, { backgroundColor: theme.colors.onTertiary }]}
          />
        )}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {error.message as string}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  segmentedButtons: {
    borderRadius: 20,
  },
});
