import { Pagination } from './Pagination';
import { DepartmentBasic } from './Department';

export interface TeacherAssignmentUser {
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar?: string;
  department?: DepartmentBasic;
}

export interface TeacherAssignmentCourse {
  courseId: number;
  courseCode: string;
  name: string;
}

export interface TeacherAssignmentSubject {
  subjectId: number;
  subjectCode: string;
  name: string;
}

export interface TeacherAssignment {
  assignmentId: number;
  teacher: TeacherAssignmentUser;
  course: TeacherAssignmentCourse;
  subject: TeacherAssignmentSubject;
  createdAt: string;
  isActive: boolean;
}

export interface PaginatedTeacherAssignments {
  data: TeacherAssignment[];
  meta: Pagination;
}

export interface TeacherAssignmentsFilters {
  page?: number;
  limit?: number;
  filters?: string[];
}

export interface CreateTeacherAssignmentData {
  teacherId: string;
  courseId: number;
  subjectId: number;
}

export interface DeleteTeacherAssignmentResponse {
  message: string;
}
