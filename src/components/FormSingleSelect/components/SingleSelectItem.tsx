import React from 'react';
import { View } from 'react-native';
import { Avatar, Icon, Menu, Text, TouchableRipple } from 'react-native-paper';
import type { AppTheme } from '../../../theme';
import { addOpacity } from '../../../utils/colorUtils';
import { styles } from '../FormSingleSelect.styles';

export interface SingleSelectOption {
  value: string | number;
  label: string;
  courseLabel?: string;
  subjectLabel?: string;
  avatarUrl?: string;
  avatarLabel?: string;
}

interface SingleSelectItemProps {
  option: SingleSelectOption;
  isSelected: boolean;
  onSelect: (value: string | number) => void;
  theme: AppTheme;
}

export function SingleSelectItem({ option, isSelected, onSelect, theme }: SingleSelectItemProps) {
  if (option.courseLabel && option.subjectLabel) {
    return (
      <TouchableRipple
        onPress={() => onSelect(option.value)}
        style={[
          styles.assignmentMenuItem,
          isSelected && { backgroundColor: addOpacity(theme.colors.surfaceVariant, 0.6) },
        ]}
        rippleColor={addOpacity(theme.colors.secondary, 0.2)}
      >
        <View style={styles.assignmentOptionContent}>
          <View style={styles.assignmentOptionSegment}>
            <Icon source="book-education" size={16} color={theme.colors.warning} />
            <Text variant="bodyMedium" style={styles.assignmentOptionText} numberOfLines={1}>
              {option.courseLabel}
            </Text>
          </View>
          <Text variant="bodyMedium" style={[styles.assignmentOptionSeparator, { color: theme.colors.grey }]}>-</Text>
          <View style={styles.assignmentOptionSegment}>
            <Icon source="book-open-variant" size={16} color={theme.colors.quaternary} />
            <Text variant="bodyMedium" style={styles.assignmentOptionText} numberOfLines={1}>
              {option.subjectLabel}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }

  if (option.avatarLabel) {
    return (
      <TouchableRipple
        onPress={() => onSelect(option.value)}
        style={[
          styles.userMenuItem,
          isSelected && { backgroundColor: addOpacity(theme.colors.surfaceVariant, 0.6) },
        ]}
        rippleColor={addOpacity(theme.colors.secondary, 0.2)}
      >
        <View style={styles.userOptionContent}>
          {option.avatarUrl ? (
            <Avatar.Image size={30} source={{ uri: option.avatarUrl }} />
          ) : (
            <Avatar.Text size={30} label={option.avatarLabel} color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.tertiary }} />
          )}
          <Text variant="bodyMedium" style={styles.userOptionText} numberOfLines={1}>
            {option.label}
          </Text>
        </View>
      </TouchableRipple>
    );
  }

  return (
    <Menu.Item
      key={String(option.value)}
      onPress={() => onSelect(option.value)}
      title={option.label}
      style={
        isSelected
          ? [styles.selectedMenuItem, { backgroundColor: addOpacity(theme.colors.surfaceVariant, 0.6) }]
          : styles.menuItem
      }
      titleStyle={theme.fonts.bodyMedium}
      rippleColor={addOpacity(theme.colors.secondary, 0.2)}
    />
  );
}
