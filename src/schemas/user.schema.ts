import { z } from 'zod';
import { RoleName } from '../types/User';

// Schema para CREAR usuario
export const UserCreateSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastname: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .refine(
      (val) => /[A-Z]/.test(val),
      { message: 'Debe contener al menos una mayúscula' }
    )
    .refine(
      (val) => /[a-z]/.test(val),
      { message: 'Debe contener al menos una minúscula' }
    )
    .refine(
      (val) => /[0-9]/.test(val),
      { message: 'Debe contener al menos un número' }
    ),
  roles: z.array(z.nativeEnum(RoleName))
    .min(1, 'Debe seleccionar al menos un rol'),
  avatar: z.string().min(1, 'Selecciona un avatar'),
  departmentId: z.number().optional(),
  validTo: z.union([z.string(), z.null()])
    .refine(
      (val) => val == null || (typeof val === 'string' && val.trim().length > 0),
      { message: 'Debe seleccionar una fecha válida' }
    ),
}).refine(
  (data) => {
    if (data.roles.includes(RoleName.TEACHER)) {
      return data.departmentId !== undefined;
    }
    return true;
  },
  {
    message: 'El departamento es obligatorio para profesores',
    path: ['departmentId'],
  }
);

// Schema para EDITAR usuario
export const UserEditSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastname: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .refine(
      (val) => val === '' || val.length >= 8,
      { message: 'La contraseña debe tener al menos 8 caracteres' }
    )
    .refine(
      (val) => val === '' || /[A-Z]/.test(val),
      { message: 'Debe contener al menos una mayúscula' }
    )
    .refine(
      (val) => val === '' || /[a-z]/.test(val),
      { message: 'Debe contener al menos una minúscula' }
    )
    .refine(
      (val) => val === '' || /[0-9]/.test(val),
      { message: 'Debe contener al menos un número' }
    ),
  roles: z.array(z.nativeEnum(RoleName))
    .min(1, 'Debe seleccionar al menos un rol'),
  avatar: z.string().min(1, 'Selecciona un avatar'),
  departmentId: z.number().optional(),
  validTo: z.union([z.string(), z.null()])
    .refine(
      (val) => val == null || (typeof val === 'string' && val.trim().length > 0),
      { message: 'Debe seleccionar una fecha válida' }
    ),
}).refine(
  (data) => {
    if (data.roles.includes(RoleName.TEACHER)) {
      return data.departmentId !== undefined;
    }
    return true;
  },
  {
    message: 'El departamento es obligatorio para profesores',
    path: ['departmentId'],
  }
);

// Tipos
export type UserCreateFormData = z.infer<typeof UserCreateSchema>;
export type UserEditFormData = z.infer<typeof UserEditSchema>;
