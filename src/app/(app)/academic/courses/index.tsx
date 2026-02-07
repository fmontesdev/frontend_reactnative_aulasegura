import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useFilters } from '../../../../contexts/FilterContext';
import { useCourses, useUpdateCourse } from '../../../../hooks/queries/useCourses';
import { StyledChip } from '../../../../components/StyledChip';
import { DataTable } from '../../../../components/DataTable';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { Course } from '../../../../types/Course';
import { getCoursesColumns } from './columns.config.courses';
import { styles } from './courses.styles';

// Pantalla de gestión de cursos
export default function CoursesScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { filters } = useFilters();
  const [deactivateDialogVisible, setDeactivateDialogVisible] = useState(false);
  const [activateDialogVisible, setActivateDialogVisible] = useState(false);
  const [courseToToggle, setCourseToToggle] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Hook de TanStack Query para obtener todos los cursos
  const { data: coursesResponse, isLoading, error, isFetching, refetch } = useCourses({
    page: currentPage,
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });
  const updateCourse = useUpdateCourse();

  // Extraer datos y metadata de la respuesta paginada
  const courses = coursesResponse?.data || [];
  const pagination = coursesResponse?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleEdit = (course: Course) => {
    router.push(`/academic/courses/${course.courseId}`);
  };

  const handleDeactivateClick = (course: Course) => {
    setCourseToToggle(course);
    setDeactivateDialogVisible(true);
  };

  const handleActivateClick = (course: Course) => {
    setCourseToToggle(course);
    setActivateDialogVisible(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!courseToToggle) return;

    try {
      await updateCourse.mutateAsync({
        courseId: courseToToggle.courseId,
        data: { isActive: false },
      });
      setDeactivateDialogVisible(false);
      setCourseToToggle(null);
    } catch (error) {
      console.error('Error deactivating course:', error);
    }
  };

  const handleActivateConfirm = async () => {
    if (!courseToToggle) return;

    try {
      await updateCourse.mutateAsync({
        courseId: courseToToggle.courseId,
        data: { isActive: true },
      });
      setActivateDialogVisible(false);
      setCourseToToggle(null);
    } catch (error) {
      console.error('Error activating course:', error);
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateDialogVisible(false);
    setCourseToToggle(null);
  };

  const handleActivateCancel = () => {
    setActivateDialogVisible(false);
    setCourseToToggle(null);
  };

  const columns = getCoursesColumns();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando cursos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (     
      <View style={[styles.container, styles.centered]}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Error al cargar cursos
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
          Gestión de Cursos
        </Text>

        {/* Botón crear curso */}
        <Button
          icon="plus"
          mode="contained"
          onPress={() => router.push('/academic/courses/create')}
          style={{ backgroundColor: theme.colors.success }}
        >
          Nuevo Curso
        </Button>
      </View>

      <DataTable
        data={courses}
        columns={columns}
        keyExtractor={(course) => String(course.courseId)}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        limitOptions={[5, 10, 20, 50]}
        renderRow={(course) => (
          <>
            {/* Columna de código */}
            <View style={styles.cellCode}>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {course.courseCode}
              </Text>
            </View>

            {/* Columna de nombre */}
            <View style={styles.cellName}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {course.name}
              </Text>
            </View>

            {/* Columna de etapa educativa */}
            <View style={styles.cellStage}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {course.educationStage}
              </Text>
            </View>

            {/* Columna de nivel */}
            <View style={styles.cellLevel}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {course.levelNumber}º
              </Text>
            </View>

            {/* Columna de nivel CF */}
            <View style={styles.cellCFLevel}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {course.cfLevel ?? '-'}
              </Text>
            </View>

            {/* Columna de estado */}
            <View style={styles.cellStatus}>
              <View style={styles.chipWrapper}>
                <StyledChip color={course.isActive ? theme.colors.success : theme.colors.grey}>
                  {course.isActive ? 'Activo' : 'Inactivo'}
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
                  onPress={() => handleEdit(course)}
                  style={{
                    marginVertical: -1,
                    marginLeft: -10,
                  }}
                />
              </TooltipWrapper>
              {course.isActive ? (
                <TooltipWrapper title="Desactivar">
                  <IconButton
                    icon="toggle-switch-off"
                    size={24}
                    iconColor={theme.colors.error}
                    onPress={() => handleDeactivateClick(course)}
                    style={{
                      marginVertical: -3,
                      marginLeft: -2,
                    }}
                  />
                </TooltipWrapper>
              ) : (
                <TooltipWrapper title="Activar">
                  <IconButton
                    icon="toggle-switch"
                    size={24}
                    iconColor={theme.colors.success}
                    onPress={() => handleActivateClick(course)}
                    style={{
                      marginVertical: -3,
                      marginLeft: -2,
                    }}
                  />
                </TooltipWrapper>
              )}
            </View>
          </>
        )}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay cursos disponibles"
        defaultSortKey="educationStage"
      />

      {/* Diálogo de confirmación para desactivar curso */}
      <ConfirmDialog
        visible={deactivateDialogVisible}
        onDismiss={handleDeactivateCancel}
        onConfirm={handleDeactivateConfirm}
        title="Confirmar desactivación"
        message="¿Estás seguro de que deseas desactivar el curso"
        highlightedText={courseToToggle?.name || ''}
        confirmText="Desactivar"
        cancelText="Cancelar"
        isLoading={updateCourse.isPending}
        variant="danger"
      />

      {/* Diálogo de confirmación para activar curso */}
      <ConfirmDialog
        visible={activateDialogVisible}
        onDismiss={handleActivateCancel}
        onConfirm={handleActivateConfirm}
        title="Confirmar activación"
        message="¿Estás seguro de que deseas activar el curso"
        highlightedText={courseToToggle?.name || ''}
        confirmText="Activar"
        cancelText="Cancelar"
        isLoading={updateCourse.isPending}
        variant="success"
      />
    </View>
  );
}
