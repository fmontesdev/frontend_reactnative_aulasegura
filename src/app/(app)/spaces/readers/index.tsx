import React, { useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useFilters } from '../../../../contexts/FilterContext';
import { usePaginationParams } from '../../../../hooks/usePaginationParams';
import { useDeleteReader, useReaders } from '../../../../hooks/queries/useReaders';
import { DataTable } from '../../../../components/DataTable';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ErrorState } from '../../../../components/ErrorState';
import { StyledChip } from '../../../../components/StyledChip';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { Reader } from '../../../../types/Reader';
import { addOpacity } from '../../../../utils/colorUtils';
import { getReadersColumns } from './columns.config.readers';
import { styles } from './readers.styles';

export default function ReadersScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { filters } = useFilters();
  const { page: currentPage, limit: currentLimit, setPage, setLimit } = usePaginationParams({ filters });
  const [deactivateDialogVisible, setDeactivateDialogVisible] = useState(false);
  const [readerToDeactivate, setReaderToDeactivate] = useState<Reader | null>(null);

  const { data: readersResponse, isLoading, error, isFetching, refetch } = useReaders({
    page: currentPage,
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });
  const deleteReader = useDeleteReader();

  const readers = readersResponse?.data || [];
  const pagination = readersResponse?.meta;
  const columns = getReadersColumns();

  const handleEdit = (reader: Reader) => {
    router.push(`/spaces/readers/${reader.readerId}`);
  };

  const handleDeactivateClick = (reader: Reader) => {
    setReaderToDeactivate(reader);
    setDeactivateDialogVisible(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!readerToDeactivate) return;

    try {
      await deleteReader.mutateAsync(readerToDeactivate.readerId);
      setDeactivateDialogVisible(false);
      setReaderToDeactivate(null);
    } catch (error) {
      console.error('Error deactivating reader:', error);
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateDialogVisible(false);
    setReaderToDeactivate(null);
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
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
          Gestión de Lectores
        </Text>

        <Button
          icon="plus"
          mode="contained"
          onPress={() => router.push('/spaces/readers/create')}
          style={{ backgroundColor: theme.colors.success }}
        >
          Nuevo Lector
        </Button>
      </View>

      <DataTable
        data={readers}
        columns={columns}
        keyExtractor={(reader) => String(reader.readerId)}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        limitOptions={[5, 10, 20, 50]}
        renderRow={(reader) => (
          <>
            <View style={styles.cellCode}>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{reader.readerCode}</Text>
            </View>

            <View style={styles.cellRoom}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {reader.roomCode || reader.roomName
                  ? `${reader.roomName || ''} ${reader.roomCode || ''}`.trim()
                  : reader.roomId != null ? `Aula #${reader.roomId}` : 'Sin aula'}
              </Text>
            </View>

            <View style={styles.cellStatus}>
              <View style={styles.chipWrapper}>
                <StyledChip color={reader.isActive ? theme.colors.success : theme.colors.grey}>
                  {reader.isActive ? 'Activo' : 'Inactivo'}
                </StyledChip>
              </View>
            </View>

            <View style={styles.cellActions}>
              <TooltipWrapper title="Editar">
                <IconButton
                  icon="pencil"
                  size={20}
                  iconColor={theme.colors.secondary}
                  onPress={() => handleEdit(reader)}
                  style={{
                    marginVertical: -2,
                    marginLeft: -10,
                    borderWidth: 1,
                    borderColor: addOpacity(theme.colors.secondary, 0.3),
                    borderRadius: 20,
                  }}
                />
              </TooltipWrapper>
              <TooltipWrapper title="Desactivar">
                <IconButton
                  icon="toggle-switch-off"
                  size={20}
                  iconColor={theme.colors.error}
                  onPress={() => handleDeactivateClick(reader)}
                  style={{
                    marginVertical: -2,
                    marginLeft: -2,
                    borderWidth: 1,
                    borderColor: addOpacity(theme.colors.error, 0.3),
                    borderRadius: 20,
                  }}
                />
              </TooltipWrapper>
            </View>
          </>
        )}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay lectores disponibles"
        defaultSortKey="readerCode"
      />

      <ConfirmDialog
        visible={deactivateDialogVisible}
        onDismiss={handleDeactivateCancel}
        onConfirm={handleDeactivateConfirm}
        title="Confirmar desactivación"
        message="¿Estás seguro de que deseas desactivar el lector"
        highlightedText={readerToDeactivate?.readerCode || ''}
        confirmText="Desactivar"
        cancelText="Cancelar"
        isLoading={deleteReader.isPending}
        variant="danger"
      />
    </View>
  );
}
