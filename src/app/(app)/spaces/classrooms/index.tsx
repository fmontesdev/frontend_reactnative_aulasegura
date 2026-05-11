import React, { useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useFilters } from '../../../../contexts/FilterContext';
import { usePaginationParams } from '../../../../hooks/usePaginationParams';
import { useDeleteRoom, useRooms } from '../../../../hooks/queries/useRooms';
import { DataTable } from '../../../../components/DataTable';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ErrorState } from '../../../../components/ErrorState';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { Room } from '../../../../types/Room';
import { addOpacity } from '../../../../utils/colorUtils';
import { getRoomsColumns } from './columns.config.rooms';
import { styles } from './classrooms.styles';

export default function ClassroomsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { filters } = useFilters();
  const { page: currentPage, limit: currentLimit, setPage, setLimit } = usePaginationParams({ filters });
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const { data: roomsResponse, isLoading, error, isFetching, refetch } = useRooms({
    page: currentPage,
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });
  const deleteRoom = useDeleteRoom();

  const rooms = roomsResponse?.data || [];
  const pagination = roomsResponse?.meta;
  const columns = getRoomsColumns();

  const handleEdit = (room: Room) => {
    router.push(`/spaces/classrooms/${room.roomId}`);
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;

    try {
      await deleteRoom.mutateAsync(roomToDelete.roomId);
      setDeleteDialogVisible(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setRoomToDelete(null);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando aulas...
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar aulas" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
          Gestión de Aulas
        </Text>

        <Button
          icon="plus"
          mode="contained"
          onPress={() => router.push('/spaces/classrooms/create')}
          style={{ backgroundColor: theme.colors.success }}
        >
          Nueva Aula
        </Button>
      </View>

      <DataTable
        data={rooms}
        columns={columns}
        keyExtractor={(room) => String(room.roomId)}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        limitOptions={[5, 10, 20, 50]}
        renderRow={(room) => (
          <>
            <View style={styles.cellName}>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{`${room.name} ${room.roomCode}`}</Text>
            </View>

            <View style={styles.cellCourse}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{room.courseName || '-'}</Text>
            </View>

            <View style={styles.cellSmall}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{room.building}</Text>
            </View>

            <View style={styles.cellSmall}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{room.floor}</Text>
            </View>

            <View style={styles.cellSmall}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{room.capacity}</Text>
            </View>

            <View style={styles.cellReaders}>
              <TooltipWrapper
                title={room.readers?.length
                  ? room.readers.map((reader) => reader.readerCode).join('\n')
                  : 'Sin lectores'}
                multiline
                style={styles.readersTooltip}
              >
                <View style={[styles.readersBadge, { backgroundColor: addOpacity(theme.colors.tertiary, 0.12) }]}> 
                  <Text variant="labelSmall" style={[styles.readersBadgeText, { color: theme.colors.tertiary }]}> 
                    {String(room.readers?.length || 0)}
                  </Text>
                </View>
              </TooltipWrapper>
            </View>

            <View style={styles.cellActions}>
              <TooltipWrapper title="Editar">
                <IconButton
                  icon="pencil"
                  size={20}
                  iconColor={theme.colors.secondary}
                  onPress={() => handleEdit(room)}
                  style={{
                    marginVertical: -2,
                    marginLeft: -10,
                    borderWidth: 1,
                    borderColor: addOpacity(theme.colors.secondary, 0.3),
                    borderRadius: 20,
                  }}
                />
              </TooltipWrapper>
              <TooltipWrapper title="Eliminar">
                <IconButton
                  icon="trash-can"
                  size={20}
                  iconColor={theme.colors.error}
                  onPress={() => handleDeleteClick(room)}
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
        emptyMessage="No hay aulas disponibles"
        defaultSortKey="name"
      />

      <ConfirmDialog
        visible={deleteDialogVisible}
        onDismiss={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar el aula"
        highlightedText={roomToDelete?.name || ''}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteRoom.isPending}
        variant="danger"
      />
    </View>
  );
}
