import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useAppTheme } from '../theme';

interface FormTextInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  errors: FieldErrors<T>;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  label,
  errors,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
}: FormTextInputProps<T>) {
  const theme = useAppTheme();
  const error = errors[name];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View>
          <TextInput
            label={label}
            value={value as string}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!error}
            mode="outlined"
            dense
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            style={[styles.input, { backgroundColor: theme.colors.onTertiary }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.tertiary}
            outlineStyle={styles.inputOutline}
            theme={{ colors: { onSurfaceVariant: theme.colors.grey } }}
            contentStyle={theme.fonts.bodyMedium}
          />
          {error && (
            <HelperText type="error" visible={!!error}>
              {error.message as string}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
  },
  inputOutline: {
    borderRadius: 20,
  },
});
