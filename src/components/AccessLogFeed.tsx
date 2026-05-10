import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AccessLog } from '../types/AccessLog';
import { AccessLogItem } from './AccessLogItem';
import { useAppTheme } from '../theme';

interface AccessLogFeedProps {
  events: AccessLog[];
  maxHeight?: number;
}

export function AccessLogFeed({ events, maxHeight }: AccessLogFeedProps) {
  const theme = useAppTheme();

  const renderItem = useCallback<ListRenderItem<AccessLog>>(({ item, index }) => {
    return <AccessLogItem accessLog={item} isLast={index === events.length - 1} />;
  }, [events.length]);

  const keyExtractor = useCallback((accessLog: AccessLog) => {
    return String(accessLog.accessLogId);
  }, []);

  const renderEmptyState = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
          Esperando nuevos eventos de acceso...
        </Text>
      </View>
    );
  }, [theme.colors.grey]);

  return (
    <FlatList
      data={events}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyState}
      style={maxHeight ? { maxHeight } : undefined}
      contentContainerStyle={events.length === 0 ? styles.emptyListContent : undefined}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});
