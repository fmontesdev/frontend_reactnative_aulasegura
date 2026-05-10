import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { Icon } from 'react-native-paper';
import { usePathname } from 'expo-router';
import { useAppTheme } from '../../theme';
import { addOpacity } from '../../utils/colorUtils';
import { useFilters } from '../../contexts/FilterContext';
import { StyledChip } from '../StyledChip';
import { TooltipWrapper } from '../TooltipWrapper';

const ACCESS_LOGS_SEARCH_HELP = `Ejemplos válidos:\njuan\ndenegado\ntiempo agotado\nusuario:juan\ntipo:rfid\nestado:denegado\nfecha:hoy\nfecha:semana\naula:25`;
const DEFAULT_SEARCH_HELP = `Introduce texto y pulsa Enter o , para crear un filtro.\nEjemplos:\njuan\nemail:@gmail.com\nestado:activo`;

// Buscador global con sistema de filtros por chips
export function GlobalSearch() {
  const theme = useAppTheme();
  const pathname = usePathname();
  const { filters, addFilter, removeFilter, clearFilters } = useFilters();
  const [inputValue, setInputValue] = useState('');
  const [isClearHovered, setIsClearHovered] = useState(false);
  const searchHelp = pathname === '/supervision/logs' ? ACCESS_LOGS_SEARCH_HELP : DEFAULT_SEARCH_HELP;

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
      <Icon source="magnify" size={22} color={theme.colors.grey} />
      <TooltipWrapper title={searchHelp} multiline placement="bottom">
        <View style={styles.helpIcon}>
          <Icon source="help-circle-outline" size={18} color={theme.colors.grey} />
        </View>
      </TooltipWrapper>
      
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
            // variant={filter.includes(':') ? 'info' : 'default'}
            color={filter.includes(':') ? theme.colors.tertiary : theme.colors.grey}
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

      {/* Añade botón para limpiar filtros */}
      {filters.length > 0 && (
        <Pressable
          onPress={clearFilters}
          onHoverIn={() => setIsClearHovered(true)}
          onHoverOut={() => setIsClearHovered(false)}
          style={[
            styles.clearButton,
            {
              backgroundColor: isClearHovered ? addOpacity(theme.colors.secondary, 0.1) : 'transparent',
              // @ts-ignore
              transitionDuration: '200ms',
            },
          ]}
        >
          <Icon source="close" size={18} color={theme.colors.darkGrey} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 20,
    flex: 1,
    maxWidth: 500,
    minWidth: 250,
    minHeight: 40,
  },
  chipsContainer: {
    flex: 1,
    marginLeft: 6,
  },
  helpIcon: {
    marginLeft: 6,
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
  clearButton: {
    marginLeft: 6,
    marginRight: -5,
    padding: 5,
    borderRadius: 20,
  },
});
