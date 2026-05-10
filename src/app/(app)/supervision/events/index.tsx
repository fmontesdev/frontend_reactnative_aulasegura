import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AccessLogFeed } from '../../../../components/AccessLogFeed';
import { SseConnectionBadge } from '../../../../components/SseConnectionBadge';
import { StyledCard } from '../../../../components/StyledCard';
import { useAccessLogEvents } from '../../../../hooks/useAccessLogEvents';
import { useAppTheme } from '../../../../theme';

export default function EventsScreen() {
  const theme = useAppTheme();
  const { height } = useWindowDimensions();
  const { events, connectionStatus, error, clearEvents } = useAccessLogEvents();
  const feedMaxHeight = Math.min(height * 0.55, 620);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
          Eventos de acceso en tiempo real
        </Text>
        <SseConnectionBadge status={connectionStatus} />
      </View>

      {error ? (
        <Text variant="bodyMedium" style={[styles.errorText, { color: theme.colors.error }]}> 
          {error}
        </Text>
      ) : null}

      <StyledCard style={styles.card}>
        <StyledCard.Content>
          <View style={styles.feedHeader}>
            <View style={styles.feedTitleRow}>
              <Text variant="titleLarge" style={{ color: theme.colors.secondary }}>
                Feed en directo
              </Text>
              {events.length > 0 ? (
                <View style={[styles.eventCountBadge, { backgroundColor: theme.colors.error }]}>
                  <Text variant="labelSmall" style={[styles.eventCountText, { color: theme.colors.onError }]}>
                    {events.length}
                  </Text>
                </View>
              ) : null}
            </View>
            {events.length > 0 ? (
              <Button
                mode="contained"
                compact
                icon="delete-sweep"
                onPress={clearEvents}
                style={[styles.clearButton, { backgroundColor: theme.colors.tertiary }]}
                contentStyle={styles.clearButtonContent}
                labelStyle={styles.clearButtonLabel}
              >
                Limpiar
              </Button>
            ) : null}
          </View>
          <AccessLogFeed events={events} maxHeight={feedMaxHeight} />
        </StyledCard.Content>
      </StyledCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 22,
    gap: 16,
  },
  errorText: {
    marginBottom: 16,
  },
  card: {
    alignSelf: 'stretch',
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 16,
  },
  feedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventCountBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCountText: {
    fontSize: 10,
    lineHeight: 12,
  },
  clearButton: {
    borderRadius: 20,
  },
  clearButtonContent: {
    height: 28,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  clearButtonLabel: {
    marginVertical: 0,
  },
});
