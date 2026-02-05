import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';
import { DatePickerInput, es, registerTranslation } from 'react-native-paper-dates';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useAppTheme } from '../theme';

// Registrar traducción española
registerTranslation('es', es);

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  errors: FieldErrors<T>;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  errors,
}: FormDatePickerProps<T>) {
  const theme = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Obtener el error del campo
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <DatePickerInput
            locale="es"
            label={label}
            value={value ? new Date(value as string) : undefined}
            onChange={(date) => onChange(date?.toISOString() || '')}
            inputMode="start"
            mode="outlined"
            dense
            style={[theme.fonts.bodyMedium, { backgroundColor: theme.colors.onTertiary }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.tertiary}
            outlineStyle={isFocused ? styles.outlineFocused : styles.outline}
            iconColor={theme.colors.tertiary}
            theme={{ colors: { onSurfaceVariant: theme.colors.grey } }}
            animationType="fade"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -1,
  },
  outline: {
    borderRadius: 30,
  },
  outlineFocused: {
    borderRadius: 30,
    borderWidth: 1.5,
  },
});
