import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Avatar, Button, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useFilters } from '../../../../contexts/FilterContext';
import { usePaginationParams } from '../../../../hooks/usePaginationParams';
import { useDeleteTeacherAssignment, useTeacherAssignments } from '../../../../hooks/queries/useTeacherAssignments';
import { useUsers } from '../../../../hooks/queries/useUsers';
import { API_CONFIG } from '../../../../constants';
import { DataTable } from '../../../../components/DataTable';
import { StyledChip } from '../../../../components/StyledChip';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { ErrorState } from '../../../../components/ErrorState';
import { TeacherAssignment } from '../../../../types/TeacherAssignment';
import { RoleName, User } from '../../../../types/User';
import { addOpacity } from '../../../../utils/colorUtils';
import { getTeacherAssignmentsColumns } from './columns.config.assignments';
import { styles } from './assignments.styles';

export default function TeacherAssignmentsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { filters } = useFilters();
  const { page: currentPage, limit: currentLimit, setPage, setLimit } = usePaginationParams({ filters });
  const [deactivateDialogVisible, setDeactivateDialogVisible] = useState(false);
  const [assignmentToDeactivate, setAssignmentToDeactivate] = useState<TeacherAssignment | null>(null);

  const { data: assignmentsResponse, isLoading, error, isFetching, refetch } = useTeacherAssignments({
    page: currentPage,
    limit: currentLimit,
    filters: filters.length > 0 ? filters : undefined,
  });
  const { data: teacherUsersResponse } = useUsers({ limit: 100, filters: ['rol:teacher'] });
  const deleteAssignment = useDeleteTeacherAssignment();

  const assignments = assignmentsResponse?.data || [];
  const pagination = assignmentsResponse?.meta;
  const columns = getTeacherAssignmentsColumns();
  const teachersById = useMemo(() => {
    const teacherMap = new Map<string, User>();

    (teacherUsersResponse?.data || [])
      .filter((user: User) => user.roles.includes(RoleName.TEACHER))
      .forEach((teacher: User) => {
        teacherMap.set(teacher.userId, teacher);
      });

    return teacherMap;
  }, [teacherUsersResponse?.data]);

  const handleDeactivateClick = (assignment: TeacherAssignment) => {
    setAssignmentToDeactivate(assignment);
    setDeactivateDialogVisible(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!assignmentToDeactivate) return;

    try {
      await deleteAssignment.mutateAsync(assignmentToDeactivate.assignmentId);
      setDeactivateDialogVisible(false);
      setAssignmentToDeactivate(null);
    } catch (error) {
      console.error('Error deactivating teacher assignment:', error);
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateDialogVisible(false);
    setAssignmentToDeactivate(null);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando asignaciones...
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar asignaciones" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
          Gestión de Asignaciones
        </Text>

        <Button
          icon="plus"
          mode="contained"
          onPress={() => router.push('/academic/assignments/create')}
          style={{ backgroundColor: theme.colors.success }}
        >
          Nueva Asignación
        </Button>
      </View>

      <DataTable
        data={assignments}
        columns={columns}
        keyExtractor={(assignment) => String(assignment.assignmentId)}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        limitOptions={[5, 10, 20, 50]}
        renderRow={(assignment) => {
          const teacherUser = teachersById.get(assignment.teacher.userId);
          const teacherAvatar = teacherUser?.avatar || assignment.teacher.avatar || '';
          const teacherDepartment = teacherUser?.department || assignment.teacher.department;

          return (
            <>
              <View style={styles.cellWithAvatar}>
                <Avatar.Image
                  size={32}
                  source={{ uri: `${API_CONFIG.IMAGE_SERVER_URL}/${teacherAvatar}` }}
                />
                <Text variant="bodyMedium" style={{ fontWeight: '600', marginLeft: 12 }}>
                  {assignment.teacher.name} {assignment.teacher.lastname}
                </Text>
              </View>

            <View style={styles.cellCourse}>
              <StyledChip color={theme.colors.warning}>
                {assignment.course.courseCode}
              </StyledChip>
            </View>

            <View style={styles.cellSubject}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                {assignment.subject.name}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
                {assignment.subject.subjectCode}
              </Text>
            </View>

              <View style={styles.cellDepartment}>
                {teacherDepartment ? (
                <View style={styles.chipWrapper}>
                  <StyledChip
                    color={theme.colors.grey}
                    onPress={() => router.push(`/academic/departments/${teacherDepartment.departmentId}`)}
                  >
                    {teacherDepartment.name}
                  </StyledChip>
                </View>
              ) : (
                <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                  -
                </Text>
              )}
              </View>

              <View style={styles.cellStatus}>
              <View style={styles.chipWrapper}>
                <StyledChip color={assignment.isActive ? theme.colors.success : theme.colors.grey}>
                  {assignment.isActive ? 'Activo' : 'Inactivo'}
                </StyledChip>
              </View>
              </View>

              <View style={styles.cellActions}>
              {assignment.isActive ? (
                <TooltipWrapper title="Desactivar">
                  <IconButton
                    icon="toggle-switch-off"
                    size={20}
                    iconColor={theme.colors.error}
                    onPress={() => handleDeactivateClick(assignment)}
                    style={{
                      marginVertical: -2,
                      marginLeft: -10,
                      borderWidth: 1,
                      borderColor: addOpacity(theme.colors.error, 0.3),
                      borderRadius: 20,
                    }}
                  />
                </TooltipWrapper>
              ) : null}
              </View>
            </>
          );
        }}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage="No hay asignaciones disponibles"
        defaultSortKey="teacher"
      />

      <ConfirmDialog
        visible={deactivateDialogVisible}
        onDismiss={handleDeactivateCancel}
        onConfirm={handleDeactivateConfirm}
        title="Confirmar desactivación"
        message="¿Estás seguro de que deseas desactivar la asignación"
        highlightedText={assignmentToDeactivate ? `${assignmentToDeactivate.teacher.name} ${assignmentToDeactivate.course.courseCode} ${assignmentToDeactivate.subject.subjectCode}` : ''}
        confirmText="Desactivar"
        cancelText="Cancelar"
        isLoading={deleteAssignment.isPending}
        variant="danger"
      />
    </View>
  );
}
