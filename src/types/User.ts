/**
 * Tipos para la entidad User (Usuario)
 */

import { DepartmentBasic } from './Department';
import { Pagination } from './Pagination';

export interface TeacherCourseSubjectSummary {
  subjectId: number;
  subjectCode: string;
  name: string;
}

export interface TeacherCourseSummary {
  courseId: number;
  courseCode: string;
  name: string;
  subjects: TeacherCourseSubjectSummary[];
}

// Enum de roles disponibles
export enum RoleName {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  JANITOR = 'janitor',
  SUPPORT_STAFF = 'support_staff',
}

// Usuario del sistema
export interface User {
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string;
  roles: RoleName[];
  validFrom?: string;
  validTo?: string | null;
  createdAt?: string;
  department?: DepartmentBasic;
  courses?: TeacherCourseSummary[] | null;
}

// Respuesta paginada de usuarios
export interface PaginatedUsers {
  data: User[];
  meta: Pagination;
}

// Filtros para obtener usuarios
export interface UsersFilters {
  page?: number;
  limit?: number;
  filters?: string[]; // Filtros híbridos: ["juan", "rol:admin", "email:@gmail.com"]
}

// Datos para crear un usuario
export interface CreateUserData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  roles: RoleName[];
  avatar: string;
  validTo?: string | null;
  departmentId?: number;
}

// Datos para actualizar un usuario
export interface UpdateUserData {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  avatar?: string;
  roles?: RoleName[];
  validFrom?: string;
  validTo?: string | null;
  departmentId?: number;
}

// Respuesta de eliminación de usuario
export interface DeleteUserResponse {
  message: string;
}
