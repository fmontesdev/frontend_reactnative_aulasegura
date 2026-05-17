import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-qr-code';
import { useReaders } from '../../../hooks/queries/useReaders';
import { useAppTheme } from '../../../theme';
import { ErrorState } from '../../../components/ErrorState';
import { StyledChip } from '../../../components/StyledChip';
import { Reader } from '../../../types/Reader';
import { addOpacity } from '../../../utils/colorUtils';

function getRoomLabel(reader: Reader) {
  if (reader.roomName || reader.roomCode) return `${reader.roomName || ''} ${reader.roomCode || ''}`.trim();
  return reader.roomId != null ? `Aula #${reader.roomId}` : 'Sin aula asignada';
}

export default function QRCredentialsScreen() {
  const theme = useAppTheme();
  const { height } = useWindowDimensions();
  const svgWrapperRef = useRef<View>(null);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [hoveredReaderId, setHoveredReaderId] = useState<number | null>(null);
  const { data: readersResponse, isLoading, error, refetch } = useReaders({ limit: 100, filters: ['active:true'] });
  const readers = useMemo(() => (readersResponse?.data || []).filter((reader) => reader.isActive), [readersResponse?.data]);
  const readerListMaxHeight = Math.max(300, height - 278);

  useEffect(() => {
    if (!selectedReader && readers.length > 0) {
      setSelectedReader(readers[0]);
    }
  }, [readers, selectedReader]);

  const handlePrint = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadSvg = () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined' || typeof XMLSerializer === 'undefined') return;

    const wrapperNode = svgWrapperRef.current as unknown as HTMLElement | null;
    const svgNode = wrapperNode?.querySelector('svg');
    if (!svgNode || !selectedReader) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgNode);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `qr-${selectedReader.readerCode}.svg`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando lectores...
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar lectores" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>Generar QR</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
            Selecciona un lector. El QR contiene exactamente el código del lector.
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[
          styles.readerListCard,
          {
            maxHeight: readerListMaxHeight,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}> 
          <ScrollView style={styles.readerList} contentContainerStyle={styles.readerListContent}>
            {readers.length > 0 ? readers.map((reader) => {
              const selected = selectedReader?.readerId === reader.readerId;
              const hovered = hoveredReaderId === reader.readerId;
              return (
                <Pressable
                  key={reader.readerId}
                  onPress={() => setSelectedReader(reader)}
                  onHoverIn={() => setHoveredReaderId(reader.readerId)}
                  onHoverOut={() => setHoveredReaderId(null)}
                  style={[
                    styles.readerRow,
                    {
                      borderColor: selected ? 'transparent' : addOpacity(theme.colors.outlineVariant, 0.8),
                      backgroundColor: selected
                        ? addOpacity(theme.colors.secondary, 0.08)
                        : hovered ? addOpacity(theme.colors.secondary, 0.04) : theme.colors.surface,
                    },
                  ]}
                >
                  <View style={styles.readerInfo}>
                    <View style={styles.readerMetaLine}>
                      <View style={styles.readerMetaItem}>
                        <MaterialCommunityIcons name="card-search" size={18} color={theme.colors.grey} />
                        <Text variant="titleSmall" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
                          {reader.readerCode}
                        </Text>
                      </View>
                      <View style={styles.readerMetaItem}>
                        <MaterialCommunityIcons name="door" size={18} color={theme.colors.grey} />
                        <Text variant="bodyMedium" style={{ color: theme.colors.grey }} numberOfLines={1}>
                          {getRoomLabel(reader)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <StyledChip color={theme.colors.success}>Activo</StyledChip>
                </Pressable>
              );
            }) : (
              <Text variant="bodyLarge" style={{ color: theme.colors.grey }}>No hay lectores activos disponibles</Text>
            )}
          </ScrollView>
        </View>

        <View style={[styles.previewCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}> 
          {selectedReader ? (
            <>
              <Text variant="titleLarge" style={{ color: theme.colors.secondary }}>QR de lector</Text>
              <View ref={svgWrapperRef} style={styles.qrWrapper}>
                <QRCode value={selectedReader.readerCode} size={300} />
              </View>
              <View style={styles.previewMetaLine}>
                <View style={styles.readerMetaItem}>
                  <MaterialCommunityIcons name="card-search" size={18} color={theme.colors.grey} />
                  <Text selectable variant="bodyMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
                    {selectedReader.readerCode}
                  </Text>
                </View>
                <View style={styles.readerMetaItem}>
                  <MaterialCommunityIcons name="door" size={18} color={theme.colors.grey} />
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
                    {getRoomLabel(selectedReader)}
                  </Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Button icon="printer" mode="contained" buttonColor={theme.colors.tertiary} onPress={handlePrint}>Imprimir</Button>
                <Button icon="download" mode="outlined" textColor={theme.colors.tertiary} onPress={handleDownloadSvg}>Descargar SVG</Button>
              </View>
            </>
          ) : (
            <Text variant="bodyLarge" style={{ color: theme.colors.grey }}>Selecciona un lector para generar su QR</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 24, paddingHorizontal: 2, paddingBottom: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingBottom: 22 },
  content: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 20, minHeight: 0 },
  readerListCard: { flex: 1, borderWidth: 1, borderRadius: 20, overflow: 'hidden' },
  readerList: { flex: 1 },
  readerListContent: { paddingBottom: 0 },
  readerRow: {
    minHeight: 53.5,
    borderWidth: 1,
    borderTopWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  readerInfo: { flex: 1 },
  readerMetaLine: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  readerMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0 },
  previewMetaLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10 },
  previewCard: {
    width: 430,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
  qrWrapper: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12 },
  actions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
});
