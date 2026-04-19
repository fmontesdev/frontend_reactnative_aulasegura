import { User } from './User';
import { DepartmentBasic } from './Department';
import { RoleName } from './User';

// Contexto de autenticación
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Respuesta del login/refresh
export interface AuthResponse {
  accessToken: string;
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string;
  roles: RoleName[];
  department?: DepartmentBasic;
}

// Request de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Request de cambio de contraseña
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
