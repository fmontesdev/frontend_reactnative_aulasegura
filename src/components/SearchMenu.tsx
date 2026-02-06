import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Menu, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { addOpacity } from '../utils/colorUtils';
import { useFilters } from '../contexts/FilterContext';
import { StyledChip } from './StyledChip';

// Menú de búsqueda global del Topbar (versión responsive para pantallas pequeñas)
export function SearchMenu() {
  const theme = useAppTheme();
  const { filters, addFilter, removeFilter } = useFilters();
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Maneja tecla Enter o coma para agregar filtro
  const handleKeyPress = (e: any) => {
    const key = e.nativeEvent.key;
    
    // Enter o coma para crea chip
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
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable
            style={[
              styles.iconButton,
              {
                backgroundColor: isHovered ? addOpacity(theme.colors.secondary, 0.1) : 'transparent',
                borderRadius: 25,
                // @ts-ignore
                transitionDuration: '200ms',
              },
            ]}
            onPress={() => setVisible(true)}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
          >
            <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.grey} />
            {filters.length > 0 && (
              <Badge
                size={18}
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.secondary }
                ]}
              >
                {filters.length}
              </Badge>
            )}
          </Pressable>
        }
        contentStyle={[
          styles.menu,
          { backgroundColor: theme.colors.surface }
        ]}
      >
        <View style={styles.menuContent}>
          {/* Contenedor de búsqueda */}
          <View style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.background,
              borderColor: addOpacity(theme.colors.secondary, 0.15),
            }
          ]}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.grey} />
            
            <View style={styles.chipsAndInputContainer}>
              {/* Chips de filtros dentro del input */}
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
                  }
                ]}
                placeholder={filters.length === 0 ? "Buscar... Enter o , para agregar" : "Agregar filtro..."}
                placeholderTextColor={theme.colors.grey}
                value={inputValue}
                onChangeText={setInputValue}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            </View>
          </View>
        </View>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 10,
  },
  menu: {
    marginTop: 64,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuContent: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    minWidth: 340,
    maxWidth: 380,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipsAndInputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    minWidth: 120,
    paddingVertical: 4,
    outlineStyle: 'none',
  } as any,
});
