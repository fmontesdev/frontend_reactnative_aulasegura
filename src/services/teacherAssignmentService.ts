import {
  CreateTeacherAssignmentData,
  DeleteTeacherAssignmentResponse,
  PaginatedTeacherAssignments,
  TeacherAssignment,
  TeacherAssignmentsFilters,
} from '../types/TeacherAssignment';
import apiService from './apiService';

interface BackendTeacherAssignmentsResponse extends Omit<PaginatedTeacherAssignments, 'meta'> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevious?: boolean;
    hasNext?: boolean;
  };
}

function normalizeAssignmentsResponse(response: BackendTeacherAssignmentsResponse): PaginatedTeacherAssignments {
  return {
    data: response.data,
    meta: {
      ...response.meta,
      hasPrevious: response.meta.hasPrevious ?? response.meta.page > 1,
      hasNext: response.meta.hasNext ?? response.meta.page < response.meta.totalPages,
    },
  };
}

export const teacherAssignmentService = {
  async getAllAssignments(filters?: TeacherAssignmentsFilters): Promise<PaginatedTeacherAssignments> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    if (filters?.filters && filters.filters.length > 0) {
      params.append('filters', filters.filters.join(','));
    }

    const queryString = params.toString();
    const url = queryString ? `/teachers/assignments?${queryString}` : '/teachers/assignments';
    const response = await apiService.get<BackendTeacherAssignmentsResponse>(url);

    return normalizeAssignmentsResponse(response);
  },

  async createAssignment(data: CreateTeacherAssignmentData): Promise<TeacherAssignment> {
    return apiService.post<TeacherAssignment>('/teachers/assignments', data);
  },

  async deleteAssignment(assignmentId: number): Promise<DeleteTeacherAssignmentResponse> {
    return apiService.delete<DeleteTeacherAssignmentResponse>(`/teachers/assignments/${assignmentId}`);
  },
};
