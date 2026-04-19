/**
 * Hooks de TanStack Query para gestión de cursos
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { courseService } from '../../services/courseService';
import { CreateCourseData, UpdateCourseData, CoursesFilters } from '../../types/Course';

// Keys para el caché de React Query
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (courseId: number) => [...courseKeys.details(), courseId] as const,
};

// Hook para obtener todos los cursos con filtros opcionales
export function useCourses(filters?: CoursesFilters) {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => courseService.getAllCourses(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
    placeholderData: keepPreviousData,
  });
}

// Hook para obtener un curso específico por ID
export function useCourse(courseId?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: courseKeys.detail(courseId!),
    queryFn: () => courseService.getCourseById(courseId!),
    enabled: !!courseId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para crear un curso
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseData) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

// Hook para actualizar un curso
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: UpdateCourseData }) =>
      courseService.updateCourse(courseId, data),
    onSuccess: (updatedCourse) => {
      // Actualiza el detalle inmediatamente desde la respuesta (sin re-fetch)
      queryClient.setQueryData(courseKeys.detail(updatedCourse.courseId), updatedCourse);
      // Invalida la lista para que refleje el cambio
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

// Hook para eliminar un curso
export function useSoftDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => courseService.deleteCourse(courseId),
    onSuccess: (_, deletedCourseId) => {
      // Elimina el detalle del caché
      queryClient.removeQueries({ queryKey: courseKeys.detail(deletedCourseId) });
      // Invalida la lista
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
