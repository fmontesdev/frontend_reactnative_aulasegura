import { Department } from './Department';

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
  department?: Department;
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