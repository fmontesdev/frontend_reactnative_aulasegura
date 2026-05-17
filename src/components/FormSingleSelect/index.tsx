import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Avatar, Icon, Menu, Text, TextInput, HelperText } from 'react-native-paper';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useAppTheme } from '../../theme';
import { SingleSelectOption, SingleSelectItem } from './components/SingleSelectItem';
import { styles } from './FormSingleSelect.styles';

export type { SingleSelectOption };

interface FormSingleSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  errors: FieldErrors<T>;
  options: SingleSelectOption[];
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
  disabled?: boolean;
  menuStyle?: StyleProp<ViewStyle>;
  menuContentStyle?: StyleProp<ViewStyle>;
}

export function FormSingleSelect<T extends FieldValues>({
  control,
  name,
  label,
  errors,
  options,
  isLoading = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay opciones disponibles',
  disabled = false,
  menuStyle,
  menuContentStyle,
}: FormSingleSelectProps<T>) {
  const theme = useAppTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const error = errors[name];

  const handleSelect = (onChange: (value: any) => void, value: string | number) => {
    onChange(value);
    setMenuVisible(false);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const selectedOption = options.find((opt) => opt.value === value);
        const selectedHasAssignmentContent = !!selectedOption?.courseLabel && !!selectedOption?.subjectLabel;
        const selectedHasUserContent = !!selectedOption?.avatarLabel;
        const outlineColor = error ? theme.colors.error : menuVisible ? theme.colors.tertiary : theme.colors.outline;

        return (
          <View>
            <Menu
              visible={menuVisible && !disabled}
              onDismiss={() => setMenuVisible(false)}
              anchorPosition="bottom"
              elevation={1}
              contentStyle={[styles.menuContent, { backgroundColor: theme.colors.onTertiary }, menuContentStyle]}
              style={[styles.menuContainer, menuStyle]}
              anchor={
                <Pressable onPress={() => !disabled && setMenuVisible(true)} disabled={disabled}>
                  {selectedHasAssignmentContent ? (
                    <View
                      pointerEvents="none"
                      style={[
                        styles.assignmentInput,
                        { backgroundColor: theme.colors.onTertiary, borderColor: outlineColor },
                        menuVisible && styles.inputOutlineFocused,
                        disabled && styles.disabledInput,
                      ]}
                    >
                      <Text variant="labelSmall" style={[styles.floatingInputLabel, { color: error ? theme.colors.error : theme.colors.grey, backgroundColor: theme.colors.onTertiary }]}> 
                        {label}
                      </Text>
                      <View style={styles.assignmentInputContent}>
                        <View style={styles.assignmentInputSegment}>
                          <Icon source="book-education" size={16} color={theme.colors.warning} />
                          <Text variant="bodyMedium" style={styles.assignmentOptionText} numberOfLines={1}>
                            {selectedOption?.courseLabel}
                          </Text>
                        </View>
                        <Text variant="bodyMedium" style={[styles.assignmentOptionSeparator, { color: theme.colors.grey }]}>-</Text>
                        <View style={styles.assignmentInputSegment}>
                          <Icon source="book-open-variant" size={16} color={theme.colors.quaternary} />
                          <Text variant="bodyMedium" style={styles.assignmentOptionText} numberOfLines={1}>
                            {selectedOption?.subjectLabel}
                          </Text>
                        </View>
                        <Icon source={menuVisible ? 'menu-up' : 'menu-down'} size={22} color={theme.colors.grey} />
                      </View>
                    </View>
                  ) : selectedHasUserContent ? (
                    <View
                      pointerEvents="none"
                      style={[
                        styles.userInput,
                        { backgroundColor: theme.colors.onTertiary, borderColor: outlineColor },
                        menuVisible && styles.inputOutlineFocused,
                        disabled && styles.disabledInput,
                      ]}
                    >
                      <Text variant="labelSmall" style={[styles.floatingInputLabel, { color: error ? theme.colors.error : theme.colors.grey, backgroundColor: theme.colors.onTertiary }]}> 
                        {label}
                      </Text>
                      <View style={styles.userInputContent}>
                        {selectedOption?.avatarUrl ? (
                          <Avatar.Image size={28} source={{ uri: selectedOption.avatarUrl }} />
                        ) : (
                          <Avatar.Text size={28} label={selectedOption?.avatarLabel ?? '-'} color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.tertiary }} />
                        )}
                        <Text variant="bodyMedium" style={styles.userOptionText} numberOfLines={1}>
                          {selectedOption?.label}
                        </Text>
                        <Icon source={menuVisible ? 'menu-up' : 'menu-down'} size={22} color={theme.colors.grey} />
                      </View>
                    </View>
                  ) : (
                    <TextInput
                    label={label}
                    value={selectedOption?.label || ''}
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
                  )}
                </Pressable>
              }
            >
              <ScrollView style={styles.menuScroll}>
                {isLoading ? (
                  <Menu.Item title={loadingText} disabled />
                ) : options.length > 0 ? (
                  options.map((option) => (
                    <SingleSelectItem
                      key={String(option.value)}
                      option={option}
                      isSelected={value === option.value}
                      onSelect={(selectedValue) => handleSelect(onChange, selectedValue)}
                      theme={theme}
                    />
                  ))
                ) : (
                  <Menu.Item title={emptyText} disabled />
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
