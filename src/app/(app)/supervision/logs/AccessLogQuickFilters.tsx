import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useFilters } from '../../../../contexts/FilterContext';
import { QuickSegmentedFilterGroup } from '../../../../components/QuickFilters/QuickSegmentedFilterGroup';

const DATE_FILTERS = ['fecha:hoy', 'fecha:semana', 'fecha:mes'];
const METHOD_FILTERS = ['tipo:rfid', 'tipo:nfc', 'tipo:qr'];
const STATUS_FILTERS = ['estado:permitido', 'estado:denegado', 'estado:salida', 'estado:tiempo agotado'];

function findSelectedFilter(filters: string[], group: string[]) {
  return filters.find((filter) => group.includes(filter));
}

export function AccessLogQuickFilters() {
  const { filters, addFilter, removeFilter } = useFilters();

  const selectedDate = findSelectedFilter(filters, DATE_FILTERS);
  const selectedMethod = findSelectedFilter(filters, METHOD_FILTERS);
  const selectedStatus = findSelectedFilter(filters, STATUS_FILTERS);

  const toggleGroupFilter = (value: string, group: string[]) => {
    const selected = filters.includes(value);

    filters
      .map((filter, index) => ({ filter, index }))
      .filter(({ filter }) => group.includes(filter))
      .reverse()
      .forEach(({ index }) => removeFilter(index));

    if (!selected) {
      addFilter(value);
    }
  };

  return (
    <View style={styles.container}>
      <QuickSegmentedFilterGroup
        selectedValue={selectedDate}
        onSelect={(value) => toggleGroupFilter(value, DATE_FILTERS)}
        options={[
          { label: 'Hoy', value: 'fecha:hoy' },
          { label: 'Semana', value: 'fecha:semana' },
          { label: 'Mes', value: 'fecha:mes' },
        ]}
      />

      <QuickSegmentedFilterGroup
        selectedValue={selectedMethod}
        onSelect={(value) => toggleGroupFilter(value, METHOD_FILTERS)}
        options={[
          { label: 'RFID', value: 'tipo:rfid' },
          { label: 'NFC', value: 'tipo:nfc' },
          { label: 'QR', value: 'tipo:qr' },
        ]}
      />

      <QuickSegmentedFilterGroup
        selectedValue={selectedStatus}
        onSelect={(value) => toggleGroupFilter(value, STATUS_FILTERS)}
        buttonStyle={styles.statusButton}
        options={[
          { label: 'Permitido', value: 'estado:permitido' },
          { label: 'Denegado', value: 'estado:denegado' },
          { label: 'Salida', value: 'estado:salida' },
          { label: 'Timeout', value: 'estado:tiempo agotado' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusButton: {
    minWidth: 86,
  },
});
