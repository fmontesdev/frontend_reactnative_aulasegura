import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Menu, TextInput, HelperText, Text } from 'react-native-paper';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useAppTheme } from '../../theme';
import { MultiSelectItem } from './components/MultiSelectItem';
import { styles } from './FormMultiSelect.styles';

export interface MultiSelectOption {
  value: string | number;
  label: string;
}

interface FormMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  errors: FieldErrors<T>;
  options: MultiSelectOption[];
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function FormMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  errors,
  options,
  isLoading = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay opciones disponibles',
  disabled = false,
}: FormMultiSelectProps<T>) {
  const theme = useAppTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | number | null>(null);
  const error = errors[name];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const selectedValues = (value as (string | number)[]) || [];
        const selectedLabels = options
          .filter((opt) => selectedValues.includes(opt.value))
          .map((opt) => opt.label);

        const displayText =
          selectedLabels.length > 0
            ? selectedLabels.length === 1
              ? selectedLabels[0]
              : `${selectedLabels.length} seleccionados`
            : '';

        const handleToggle = (optionValue: string | number) => {
          const newValues = selectedValues.includes(optionValue)
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];
          onChange(newValues);
        };

        return (
          <View>
            <Menu
              visible={menuVisible && !disabled}
              onDismiss={() => setMenuVisible(false)}
              anchorPosition="bottom"
              elevation={1}
              contentStyle={[styles.menuContent, { backgroundColor: theme.colors.onTertiary }]}
              style={styles.menuContainer}
              anchor={
                <Pressable onPress={() => !disabled && setMenuVisible(true)} disabled={disabled}>
                  <TextInput
                    label={label}
                    value={displayText}
                    mode="outlined"
                    dense
                    error={!!error}
                    style={[styles.input, { backgroundColor: theme.colors.onTertiary }]}
                    outlineColor={menuVisible ? theme.colors.tertiary : theme.colors.outline}
                    activeOutlineColor={theme.colors.tertiary}
                    outlineStyle={[styles.inputOutline, menuVisible && styles.inputOutlineFocused]}
                    theme={{ colors: { onSurfaceVariant: theme.colors.grey } }}
                    contentStyle={theme.fonts.bodyMedium}
                    editable={false}
                    disabled={disabled}
                    right={
                      <TextInput.Icon
                        icon={menuVisible ? 'menu-up' : 'menu-down'}
                        style={styles.menuIcon}
                        forceTextInputFocus={false}
                        disabled
                      />
                    }
                    pointerEvents="none"
                  />
                </Pressable>
              }
            >
              <ScrollView style={styles.menuScroll}>
                {isLoading ? (
                  <View style={styles.emptyItem}>
                    <Text variant="bodyMedium" style={styles.emptyItemText}>{loadingText}</Text>
                  </View>
                ) : options.length > 0 ? (
                  options.map((option) => (
                    <MultiSelectItem
                      key={String(option.value)}
                      option={option}
                      isSelected={selectedValues.includes(option.value)}
                      isHovered={hoveredOption === option.value}
                      onToggle={handleToggle}
                      onHoverIn={() => setHoveredOption(option.value)}
                      onHoverOut={() => setHoveredOption(null)}
                      theme={theme}
                    />
                  ))
                ) : (
                  <View style={styles.emptyItem}>
                    <Text variant="bodyMedium" style={styles.emptyItemText}>{emptyText}</Text>
                  </View>
                )}
              </ScrollView>
            </Menu>
            {error && (
              <HelperText type="error" visible={!!error}>
                {error.message as string}
              </HelperText>
            )}
          </View>
        );
      }}
    />
  );
}
