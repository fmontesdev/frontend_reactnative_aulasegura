import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { addOpacity } from '../utils/colorUtils';
import { useFilters } from '../contexts/FilterContext';
import { StyledChip } from './StyledChip';

// Buscador global con sistema de filtros por chips
export function GlobalSearch() {
  const theme = useAppTheme();
  const { filters, addFilter, removeFilter } = useFilters();
  const [inputValue, setInputValue] = useState('');

  // Maneja tecla Enter o coma para agregar filtro
  const handleKeyPress = (e: any) => {
    const key = e.nativeEvent.key;
    
    // Enter o coma para crear chip
    if (key === 'Enter' || key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addFilter(inputValue);
        setInputValue('');
      }
    }
  };

  // Elimina un filtro por índice
  const handleRemoveFilter = (index: number) => {
    removeFilter(index);
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.background,
        borderColor: addOpacity(theme.colors.secondary, 0.15),
        borderWidth: 1,
      }
    ]}>
      <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.grey} />
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chipsContainer}
        contentContainerStyle={styles.chipsContent}
      >
        {filters.map((filter, index) => (
          <StyledChip
            key={index}
            text={filter}
            variant={filter.includes(':') ? 'info' : 'default'}
            onClose={() => handleRemoveFilter(index)}
          />
        ))}
        
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.onSurface,
              ...theme.fonts.bodyMedium,
              outlineStyle: 'none',
            } as any
          ]}
          placeholder={filters.length === 0 ? "Buscar... Enter o , para agregar filtro" : "Agregar filtro..."}
          placeholderTextColor={theme.colors.grey}
          value={inputValue}
          onChangeText={setInputValue}
          onKeyPress={handleKeyPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    flex: 1,
    maxWidth: 500,
    minWidth: 250,
    minHeight: 40,
  },
  chipsContainer: {
    flex: 1,
    marginLeft: 8,
  },
  chipsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexGrow: 1,
  },
  input: {
    flex: 1,
    minWidth: 120,
  },
});
