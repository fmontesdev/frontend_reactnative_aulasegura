import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, IconButton, Menu, Button } from 'react-native-paper';
import { useAppTheme } from '../../../theme';
import { Pagination } from '../../../types/Pagination';
import { addOpacity } from '../../../utils/colorUtils';
import { styles } from './DataTableFooter.styles';

interface DataTableFooterProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}

export function DataTableFooter({
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
}: DataTableFooterProps) {
  const theme = useAppTheme();
  const [limitMenuVisible, setLimitMenuVisible] = useState(false);

  return (
    <View style={[styles.paginationContainer, { borderTopColor: theme.colors.outlineVariant }]}>
      {/* Totales */}
      <View style={styles.paginationLeft}>
        <Text variant="bodySmall" style={[styles.paginationText, { color: theme.colors.grey }]}>
          Mostrando {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
        </Text>
      </View>
      
      {/* Selector de limit */}
      {onLimitChange && (
        <View style={styles.limitSelector}>
          <Text variant="bodySmall" style={[styles.limitLabelText, { color: theme.colors.grey }]}>
            Filas por página:
          </Text>
          <Menu
            visible={limitMenuVisible}
            onDismiss={() => setLimitMenuVisible(false)}
            anchorPosition="bottom"
            elevation={1}
            contentStyle={[
              styles.limitMenuContent,
              { backgroundColor: theme.colors.onTertiary }
            ]}
            anchor={
              <Button
                mode="text"
                compact
                onPress={() => setLimitMenuVisible(true)}
                textColor={theme.colors.secondary}
                labelStyle={styles.limitButtonLabel}
                style={[
                  styles.limitButton,
                  styles.limitButtonBorder,
                  { borderColor: theme.colors.quaternary }
                ]}
              >
                {pagination.limit}
              </Button>
            }
          >
            {limitOptions.map((limit) => (
              <Menu.Item
                key={limit}
                onPress={() => {
                  onLimitChange(limit);
                  setLimitMenuVisible(false);
                }}
                title={limit.toString()}
                style={[
                  styles.limitMenuItem,
                  pagination.limit === limit && { backgroundColor: addOpacity(theme.colors.surfaceVariant, 0.7) }
                ]}
                contentStyle={styles.limitMenuItemContent}
                titleStyle={[theme.fonts.bodySmall, styles.limitMenuItemTitle]}
                rippleColor={addOpacity(theme.colors.secondary, 0.2)}
              />
            ))}
          </Menu>
        </View>
      )}
      
      {/* Controles paginación */}
      <View style={styles.paginationControls}>
        {/* Ir al inicio */}
        <IconButton
          icon="page-first"
          size={20}
          disabled={!pagination.hasPrevious}
          onPress={() => onPageChange(1)}
          iconColor={pagination.hasPrevious ? theme.colors.secondary : theme.colors.onSurfaceDisabled}
          style={styles.iconButtonEdge}
        />
        
        {/* Página anterior */}
        <IconButton
          icon="chevron-left"
          size={20}
          disabled={!pagination.hasPrevious}
          onPress={() => onPageChange(pagination.page - 1)}
          iconColor={pagination.hasPrevious ? theme.colors.secondary : theme.colors.onSurfaceDisabled}
          style={styles.iconButtonPrev}
        />
        
        <Text variant="bodySmall" style={[styles.paginationPageText, { color: theme.colors.grey }]}>
          {pagination.page} / {pagination.totalPages}
        </Text>
        
        {/* Página siguiente */}
        <IconButton
          icon="chevron-right"
          size={20}
          disabled={!pagination.hasNext}
          onPress={() => onPageChange(pagination.page + 1)}
          iconColor={pagination.hasNext ? theme.colors.secondary : theme.colors.onSurfaceDisabled}
          style={styles.iconButtonNext}
        />
        
        {/* Ir al final */}
        <IconButton
          icon="page-last"
          size={20}
          disabled={!pagination.hasNext}
          onPress={() => onPageChange(pagination.totalPages)}
          iconColor={pagination.hasNext ? theme.colors.secondary : theme.colors.onSurfaceDisabled}
          style={styles.iconButtonEdge}
        />
      </View>
    </View>
  );
}
