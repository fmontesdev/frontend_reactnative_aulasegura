import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useFilters } from '../../../../contexts/FilterContext';
import { useFilteredDepartments, useUpdateDepartment } from '../../../../hooks/queries/useDepartments';
import { useExpandable } from '../../../../hooks/useExpandable';
import { StyledChip } from '../../../../components/StyledChip';
import { DataTable } from '../../../../components/DataTable';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { ExpandButton } from '../../../../components/ExpandButton';
import { Department } from '../../../../types/Department';
import { getDepartmentsColumns } from './columns.config.departments';
import { addOpacity } from '../../../../utils/colorUtils';
import { styles } from './departments.styles';

// Pantalla de gestión de departamentos
export default function DepartmentsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { filters } = useFilters();
  const [deactivateDialogVisible, setDeactivateDialogVisible] = useState(false);
  const [activateDialogVisible, setActivateDialogVisible] = useState(false);
  const [departmentToToggle, setDepartmentToToggle] = useState<Department | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const { toggle: toggleExpandSubjects, isExpanded: isSubjectsExpanded, reset: resetExpandedSubjects } = useExpandable();
  const { toggle: toggleExpandTeachers, isExpanded: isTeachersExpanded, reset: resetExpandedTeachers } = useExpandable();

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Limpiar expansiones cuando cambie la página
  useEffect(() => {
    resetExpandedSubjects();
    resetExpandedTeachers();
  }, [currentPage, resetExpandedSubjects, resetExpandedTeachers]);

  // Hook de TanStack Query para obtener todos los departamentos
  const { data: departmentsResponse, isLoading, error, isFetching, refetch } = useFilteredDepartments({
    page: currentPage,
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });
  const updateDepartment = useUpdateDepartment();

  // Extraer datos y metadata de la respuesta paginada
  const departments = departmentsResponse?.data || [];
  const pagination = departmentsResponse?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleEdit = (department: Department) => {
    router.push(`/academic/departments/${department.departmentId}`);
  };

  const handleDeactivateClick = (department: Department) => {
    setDepartmentToToggle(department);
    setDeactivateDialogVisible(true);
  };

  const handleActivateClick = (department: Department) => {
    setDepartmentToToggle(department);
    setActivateDialogVisible(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!departmentToToggle) return;

    try {
      await updateDepartment.mutateAsync({
        departmentId: departmentToToggle.departmentId,
        data: { isActive: false },
      });
      setDeactivateDialogVisible(false);
      setDepartmentToToggle(null);
    } catch (error) {
      console.error('Error deactivating department:', error);
    }
  };

  const handleActivateConfirm = async () => {
    if (!departmentToToggle) return;

    try {
      await updateDepartment.mutateAsync({
        departmentId: departmentToToggle.departmentId,
        data: { isActive: true },
      });
      setActivateDialogVisible(false);
      setDepartmentToToggle(null);
    } catch (error) {
      console.error('Error activating department:', error);
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateDialogVisible(false);
    setDepartmentToToggle(null);
  };

  const handleActivateCancel = () => {
    setActivateDialogVisible(false);
    setDepartmentToToggle(null);
  };

  const columns = getDepartmentsColumns();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando departamentos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Error al cargar departamentos
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
          Gestión de Departamentos
        </Text>

        {/* Botón crear departamento */}
        <Button
          icon="plus"
          mode="contained"
          onPress={() => router.push('/academic/departments/create')}
          style={{ backgroundColor: theme.colors.success }}
        >
          Nuevo Departamento
        </Button>
      </View>

      <DataTable
        data={departments}
        columns={columns}
        keyExtractor={(department) => String(department.departmentId)}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        limitOptions={[5, 10, 20, 50]}
        renderRow={(department) => (
          <>
            {/* Columna de nombre */}
            <View style={styles.cellName}>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {department.name}
              </Text>
            </View>

            {/* Columna de asignaturas */}
            <View style={styles.cellSubjects}>
              <View style={styles.itemsContainer}>
                {(() => {
                  if (!department.subjects || department.subjects.length === 0) {
                    return (
                      <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
                        -
                      </Text>
                    );
                  }

                  const isExpanded = isSubjectsExpanded(String(department.departmentId));
                  const displaySubjects = isExpanded
                    ? department.subjects
                    : department.subjects.slice(0, 2);
                  const hasMore = department.subjects.length > 2;

                  return (
                    <>
                      {displaySubjects.map(subject => (
                        <StyledChip key={subject.subjectId} color={theme.colors.warning}>
                          {subject.subjectCode}
                        </StyledChip>
                      ))}
                      {hasMore && (
                        <ExpandButton
                          isExpanded={isExpanded}
                          onToggle={() => toggleExpandSubjects(String(department.departmentId))}
                          remainingCount={department.subjects.length - 2}
                        />
                      )}
                    </>
                  );
                })()}
              </View>
            </View>

            {/* Columna de profesores */}
            <View style={styles.cellTeachers}>
              <View style={styles.itemsContainer}>
                {(() => {
                  if (!department.teachers || department.teachers.length === 0) {
                    return (
                      <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
                        -
                      </Text>
                    );
                  }

                  const isExpanded = isTeachersExpanded(String(department.departmentId));
                  const displayTeachers = isExpanded
                    ? department.teachers
                    : department.teachers.slice(0, 2);
                  const hasMore = department.teachers.length > 2;

                  return (
                    <>
                      {displayTeachers.map(teacher => (
                        <StyledChip key={teacher.userId} color={theme.colors.secondary}>
                          {`${teacher.name} ${teacher.lastname}`}
                        </StyledChip>
                      ))}
                      {hasMore && (
                        <ExpandButton
                          isExpanded={isExpanded}
                          onToggle={() => toggleExpandTeachers(String(department.departmentId))}
                          remainingCount={department.teachers.length - 2}
                        />
                      )}
                    </>
                  );
                })()}
              </View>
            </View>

            {/* Columna de estado */}
            <View style={styles.cellStatus}>
              <View style={styles.chipWrapper}>
                <StyledChip color={department.isActive ? theme.colors.success : theme.colors.grey}>
                  {department.isActive ? 'Activo' : 'Inactivo'}
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
                  onPress={() => handleEdit(department)}
                  style={{
                    marginVertical: -1,
                    marginLeft: -10,
                    borderWidth: 1,
                    borderColor: addOpacity(theme.colors.secondary, 0.3),
                    borderRadius: 20,
                  }}
                />
              </TooltipWrapper>
              {department.isActive ? (
                <TooltipWrapper title="Desactivar">
                  <IconButton
                    icon="toggle-switch-off"
                    size={24}
                    iconColor={theme.colors.error}
                    onPress={() => handleDeactivateClick(department)}
                    style={{
                      marginVertical: -3,
                      marginLeft: -2,
                      borderWidth: 1,
                      borderColor: addOpacity(theme.colors.error, 0.3),
                      borderRadius: 20,
                    }}
                  />
                </TooltipWrapper>
              ) : (
                <TooltipWrapper title="Activar">
                  <IconButton
                    icon="toggle-switch"
                    size={24}
                    iconColor={theme.colors.success}
                    onPress={() => handleActivateClick(department)}
                    style={{
                      marginVertical: -3,
                      marginLeft: -2,
                      borderWidth: 1,
                      borderColor: addOpacity(theme.colors.success, 0.3),
                      borderRadius: 20,
                    }}
                  />
                </TooltipWrapper>
              )}
            </View>
          </>
        )}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay departamentos disponibles"
        defaultSortKey="name"
      />

      {/* Diálogo de confirmación para desactivar departamento */}
      <ConfirmDialog
        visible={deactivateDialogVisible}
        onDismiss={handleDeactivateCancel}
        onConfirm={handleDeactivateConfirm}
        title="Confirmar desactivación"
        message="¿Estás seguro de que deseas desactivar el departamento"
        highlightedText={departmentToToggle?.name || ''}
        confirmText="Desactivar"
        cancelText="Cancelar"
        isLoading={updateDepartment.isPending}
        variant="danger"
      />

      {/* Diálogo de confirmación para activar departamento */}
      <ConfirmDialog
        visible={activateDialogVisible}
        onDismiss={handleActivateCancel}
        onConfirm={handleActivateConfirm}
        title="Confirmar activación"
        message="¿Estás seguro de que deseas activar el departamento"
        highlightedText={departmentToToggle?.name || ''}
        confirmText="Activar"
        cancelText="Cancelar"
        isLoading={updateDepartment.isPending}
        variant="success"
      />
    </View>
  );
}
