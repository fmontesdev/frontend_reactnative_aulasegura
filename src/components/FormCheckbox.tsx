import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useAppTheme } from '../theme';
import { addOpacity } from '../utils/colorUtils';

interface FormCheckboxProps<T extends FieldValues> {
  label: string;
  // Para uso con react-hook-form
  control?: Control<T>;
  name?: Path<T>;
  // Para uso sin react-hook-form
  checked?: boolean;
  onPress?: () => void;
}

export function FormCheckbox<T extends FieldValues>({
  label,
  control,
  name,
  checked,
  onPress,
}: FormCheckboxProps<T>) {
  const theme = useAppTheme();

  // Si se proporciona control y name, usar Controller
  if (control && name) {
    return (
      <View style={styles.container}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <Checkbox.Item
              label={label}
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              labelStyle={[theme.fonts.labelLarge, { textAlign: 'left', color: theme.colors.onSurface }]}
              mode="android"
              color={theme.colors.tertiary}
              uncheckedColor={addOpacity(theme.colors.grey, 0.6)}
              rippleColor={addOpacity(theme.colors.secondary, 0.2)}
            />
          )}
        />
      </View>
    );
  }

  // Uso sin react-hook-form
  return (
    <View style={styles.container}>
      <Checkbox.Item
        label={label}
        status={checked ? 'checked' : 'unchecked'}
        onPress={onPress}
        labelStyle={[theme.fonts.labelLarge, { textAlign: 'left', color: theme.colors.onSurface }]}
        mode="android"
        color={theme.colors.tertiary}
        uncheckedColor={addOpacity(theme.colors.grey, 0.6)}
        rippleColor={addOpacity(theme.colors.secondary, 0.2)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    overflow: 'hidden',
  },
});
