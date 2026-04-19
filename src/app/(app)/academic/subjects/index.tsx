import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useFilters } from '../../../../contexts/FilterContext';
import { usePaginationParams } from '../../../../hooks/usePaginationParams';
import { useSubjects, useUpdateSubject } from '../../../../hooks/queries/useSubjects';
import { useExpandable } from '../../../../hooks/useExpandable';
import { StyledChip } from '../../../../components/StyledChip';
import { DataTable } from '../../../../components/DataTable';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { ExpandButton } from '../../../../components/ExpandButton';
import { Subject } from '../../../../types/Subject';
import { getSubjectsColumns } from './columns.config.subjects';
import { addOpacity } from '../../../../utils/colorUtils';
import { styles } from './subjects.styles';
import { ErrorState } from '../../../../components/ErrorState';

// Pantalla de gestión de asignaturas
export default function SubjectsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { filters } = useFilters();
  const { page: currentPage, limit: currentLimit, setPage, setLimit } = usePaginationParams({ filters });
  const [deactivateDialogVisible, setDeactivateDialogVisible] = useState(false);
  const [activateDialogVisible, setActivateDialogVisible] = useState(false);
  const [subjectToToggle, setSubjectToToggle] = useState<Subject | null>(null);
  const { toggle: toggleExpandCourses, isExpanded: isCourseExpanded, reset: resetExpandedCourses } = useExpandable();

  // Limpiar expansiones cuando cambie la página
  useEffect(() => {
    resetExpandedCourses();
  }, [currentPage, resetExpandedCourses]);

  // Hook de TanStack Query para obtener todas las asignaturas
  const { data: subjectsResponse, isLoading, error, isFetching, refetch } = useSubjects({
    page: currentPage,
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });
  const updateSubject = useUpdateSubject();

  // Extraer datos y metadata de la respuesta paginada
  const subjects = subjectsResponse?.data || [];
  const pagination = subjectsResponse?.meta;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  const handleEdit = (subject: Subject) => {
    router.push(`/academic/subjects/${subject.subjectId}`);
  };

  const handleDeactivateClick = (subject: Subject) => {
    setSubjectToToggle(subject);
    setDeactivateDialogVisible(true);
  };

  const handleActivateClick = (subject: Subject) => {
    setSubjectToToggle(subject);
    setActivateDialogVisible(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!subjectToToggle) return;

    try {
      await updateSubject.mutateAsync({
        subjectId: subjectToToggle.subjectId,
        data: { isActive: false },
      });
      setDeactivateDialogVisible(false);
      setSubjectToToggle(null);
    } catch (error) {
      console.error('Error deactivating subject:', error);
    }
  };

  const handleActivateConfirm = async () => {
    if (!subjectToToggle) return;

    try {
      await updateSubject.mutateAsync({
        subjectId: subjectToToggle.subjectId,
        data: { isActive: true },
      });
      setActivateDialogVisible(false);
      setSubjectToToggle(null);
    } catch (error) {
      console.error('Error activating subject:', error);
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateDialogVisible(false);
    setSubjectToToggle(null);
  };

  const handleActivateCancel = () => {
    setActivateDialogVisible(false);
    setSubjectToToggle(null);
  };



  const columns = getSubjectsColumns();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando asignaturas...
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar asignaturas" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Título sección */}
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
          Gestión de Asignaturas
        </Text>

        {/* Botón crear asignatura */}
        <Button
          icon="plus"
          mode="contained"
          onPress={() => router.push('/academic/subjects/create')}
          style={{ backgroundColor: theme.colors.success }}
        >
          Nueva Asignatura
        </Button>
      </View>

      <DataTable
        data={subjects}
        columns={columns}
        keyExtractor={(subject) => String(subject.subjectId)}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        limitOptions={[5, 10, 20, 50]}
        renderRow={(subject) => (
          <>
            {/* Columna de código */}
            <View style={styles.cellCode}>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {subject.subjectCode}
              </Text>
            </View>

            {/* Columna de nombre */}
            <View style={styles.cellName}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {subject.name}
              </Text>
            </View>

            {/* Columna de departamento */}
            <View style={styles.cellDepartment}>
              <View style={styles.chipWrapper}>
                <StyledChip 
                  color={theme.colors.grey}
                  onPress={() => router.push(`/academic/departments/${subject.department.departmentId}`)}
                >
                  {subject.department.name}
                </StyledChip>
              </View>
            </View>

            {/* Columna de cursos */}
            <View style={styles.cellCourses}>
              <View style={styles.coursesContainer}>
                {(() => {
                  const isExpanded = isCourseExpanded(String(subject.subjectId));
                  const displayCourses = isExpanded ? subject.courses : subject.courses.slice(0, 2);
                  const hasMore = subject.courses.length > 2;

                  return (
                    <>
                      {displayCourses.map(course => (
                        <TooltipWrapper key={course.courseId} title={course.name}>
                          <StyledChip 
                            color={theme.colors.warning}
                            onPress={() => router.push(`/academic/courses/${course.courseId}`)}
                          >
                            {course.courseCode}
                          </StyledChip>
                        </TooltipWrapper>
                      ))}
                      {hasMore && (
                        <ExpandButton
                          isExpanded={isExpanded}
                          onToggle={() => toggleExpandCourses(String(subject.subjectId))}
                          remainingCount={subject.courses.length - 2}
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
                <StyledChip color={subject.isActive ? theme.colors.success : theme.colors.grey}>
                  {subject.isActive ? 'Activo' : 'Inactivo'}
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
                  onPress={() => handleEdit(subject)}
                  style={{
                    marginVertical: -2,
                    marginLeft: -10,
                    borderWidth: 1,
                    borderColor: addOpacity(theme.colors.secondary, 0.3),
                    borderRadius: 20,
                  }}
                />
              </TooltipWrapper>
              {subject.isActive ? (
                <TooltipWrapper title="Desactivar">
                  <IconButton
                    icon="toggle-switch-off"
                    size={20}
                    iconColor={theme.colors.error}
                    onPress={() => handleDeactivateClick(subject)}
                    style={{
                      marginVertical: -2,
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
                    size={20}
                    iconColor={theme.colors.success}
                    onPress={() => handleActivateClick(subject)}
                    style={{
                      marginVertical: -2,
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
        emptyMessage="No hay asignaturas disponibles"
        defaultSortKey="name"
      />

      {/* Diálogo de confirmación para desactivar asignatura */}
      <ConfirmDialog
        visible={deactivateDialogVisible}
        onDismiss={handleDeactivateCancel}
        onConfirm={handleDeactivateConfirm}
        title="Confirmar desactivación"
        message="¿Estás seguro de que deseas desactivar la asignatura"
        highlightedText={subjectToToggle?.name || ''}
        confirmText="Desactivar"
        cancelText="Cancelar"
        isLoading={updateSubject.isPending}
        variant="danger"
      />

      {/* Diálogo de confirmación para activar asignatura */}
      <ConfirmDialog
        visible={activateDialogVisible}
        onDismiss={handleActivateCancel}
        onConfirm={handleActivateConfirm}
        title="Confirmar activación"
        message="¿Estás seguro de que deseas activar la asignatura"
        highlightedText={subjectToToggle?.name || ''}
        confirmText="Activar"
        cancelText="Cancelar"
        isLoading={updateSubject.isPending}
        variant="success"
      />
    </View>
  );
}
