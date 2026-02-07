import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Avatar, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../theme';
import { useFilters } from '../../../contexts/FilterContext';
import { useUsers, useDeleteUser } from '../../../hooks/queries/useUsers';
import { API_CONFIG } from '../../../constants';
import { StyledChip } from '../../../components/StyledChip';
import { DataTable } from '../../../components/DataTable';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TooltipWrapper } from '../../../components/TooltipWrapper';
import { User } from '../../../types/User';
import { getRoleLabel, getRoleColor } from '../../../utils/roleUtils';
import { getUsersColumns } from './columns.config.users';
import { styles } from './users.styles';

// Pantalla de gestión de usuarios
export default function UsersScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { filters } = useFilters();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Hook de TanStack Query para obtener todos los usuarios
  const { data: usersResponse, isLoading, error, isFetching, refetch } = useUsers({
    page: currentPage, 
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });
  const deleteUser = useDeleteUser();

  // Extraer datos y metadata de la respuesta paginada
  const users = usersResponse?.data || [];
  const pagination = usersResponse?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset a página 1 cuando cambia el límite
  };

  const handleEdit = (user: User) => {
    router.push(`/users/${user.userId}`);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser.mutateAsync(userToDelete.userId);
      setDeleteDialogVisible(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setUserToDelete(null);
  };

  const isUserActive = (user: User) => {
    if (!user.validTo) return true;
    const now = new Date();
    const validTo = new Date(user.validTo);
    return validTo > now;
  };

  const columns = getUsersColumns(isUserActive);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando usuarios...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Error al cargar usuarios
        </Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurface }}>
          {error instanceof Error ? error.message : 'Error desconocido'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Título sección */}
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
          Gestión de Usuarios
        </Text>

        {/* Botón crear usuario */}
        <Button
          icon="plus"
          mode="contained"
          onPress={() => router.push('/users/create')}
          style={{ backgroundColor: theme.colors.success }}
        >
          Crear Usuario
        </Button>
      </View>

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(user) => user.userId}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        limitOptions={[5, 10, 20, 50]}
        renderRow={(user) => (
          <>
            {/* Columna de usuario */}
            <View style={styles.cellWithAvatar}>
              <Avatar.Image
                size={32}
                source={{ uri: `${API_CONFIG.IMAGE_SERVER_URL}/${user.avatar}` }}
              />
              <Text variant="bodyMedium" style={{ fontWeight: '600', marginLeft: 12 }}>
                {user.name} {user.lastname}
              </Text>
            </View>

            {/* Columna de email */}
            <View style={styles.cell}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {user.email}
              </Text>
            </View>

            {/* Columna de roles */}
            <View style={styles.cellRoles}>
              <View style={styles.rolesContainer}>
                {user.roles.map((role, index) => (
                  <StyledChip key={index} color={getRoleColor(role, theme)}>
                    {getRoleLabel(role)}
                  </StyledChip>
                ))}
              </View>
            </View>

            {/* Columna de departamento */}
            <View style={styles.cellDepartment}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {user.department?.name ?? '-'}
              </Text>
            </View>

            {/* Columna de estado */}
            <View style={styles.cellStatus}>
              <View style={styles.chipWrapper}>
                <StyledChip color={isUserActive(user) ? theme.colors.success : theme.colors.grey}>
                  {isUserActive(user) ? 'Activo' : 'Inactivo'}
                </StyledChip>
              </View>
            </View>

            {/* Columna de acciones */}
            <View style={styles.cellActions}>
              <TooltipWrapper title="Editar">
                <IconButton
                  icon="pencil"
                  size={20}
                  iconColor={theme.colors.secondary}
                  onPress={() => handleEdit(user)}
                  style={{
                    marginVertical: -1,
                    marginLeft: -10,
                  }}
                />
              </TooltipWrapper>
              <TooltipWrapper title="Eliminar">
                <IconButton
                  icon="delete"
                  size={20}
                  iconColor={theme.colors.error}
                  onPress={() => handleDeleteClick(user)}
                  style={{
                    marginVertical: -1,
                    marginLeft: -2,
                  }}
                />
              </TooltipWrapper>
            </View>
          </>
        )}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay usuarios disponibles"
        defaultSortKey="name"
      />

      {/* Dialogo de confirmación para eliminar usuario */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        onDismiss={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar al usuario"
        highlightedText={userToDelete ? `${userToDelete.name} ${userToDelete.lastname}` : ''}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteUser.isPending}
        variant="danger"
      />
    </View>
  );
}
