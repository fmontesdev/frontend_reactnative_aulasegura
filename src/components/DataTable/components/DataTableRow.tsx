import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DataTableRowProps<T> {
  item: T;
  borderBottomColor: string;
  renderRow: (item: T) => React.ReactNode;
}

export function DataTableRow<T>({
  item,
  borderBottomColor,
  renderRow,
}: DataTableRowProps<T>) {
  return (
    <View style={[styles.row, { borderBottomColor }]}>
      {renderRow(item)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
});
