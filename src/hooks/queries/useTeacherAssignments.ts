import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { teacherAssignmentService } from '../../services/teacherAssignmentService';
import { CreateTeacherAssignmentData, TeacherAssignmentsFilters } from '../../types/TeacherAssignment';
import { userKeys } from './useUsers';

export const teacherAssignmentKeys = {
  all: ['teacher-assignments'] as const,
  lists: () => [...teacherAssignmentKeys.all, 'list'] as const,
  list: (filters?: TeacherAssignmentsFilters) => [...teacherAssignmentKeys.lists(), filters] as const,
};

export function useTeacherAssignments(filters?: TeacherAssignmentsFilters, enabled = true) {
  return useQuery({
    queryKey: teacherAssignmentKeys.list(filters),
    queryFn: () => teacherAssignmentService.getAllAssignments(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useCreateTeacherAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherAssignmentData) => teacherAssignmentService.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherAssignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useDeleteTeacherAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: number) => teacherAssignmentService.deleteAssignment(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherAssignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
