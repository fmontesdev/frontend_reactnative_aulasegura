import { z } from 'zod';
import { RoleName } from '../types/User';

// ─── campos compartidos (sin password) ───
const BaseUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastname: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  roles: z.array(z.nativeEnum(RoleName)).min(1, 'Debe seleccionar al menos un rol'),
  avatar: z.string().min(1, 'Selecciona un avatar'),
  departmentId: z.number().optional(),
  validTo: z.union([z.string(), z.null()])
    .refine(
      (val) => val == null || (typeof val === 'string' && val.trim().length > 0),
      { message: 'Debe seleccionar una fecha válida' }
    ),
});

// ─── regla de departamento (reutilizable) ───
const departmentRule = {
  fn: (data: { roles: RoleName[]; departmentId?: number }) =>
    data.roles.includes(RoleName.TEACHER) ? data.departmentId !== undefined : true,
  opts: { message: 'El departamento es obligatorio para profesores', path: ['departmentId'] },
};

// ─── create: password obligatorio con reglas estrictas ───
export const UserCreateSchema = BaseUserSchema
  .extend({
    password: z.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .refine((v) => /[A-Z]/.test(v), { message: 'Debe contener al menos una mayúscula' })
      .refine((v) => /[a-z]/.test(v), { message: 'Debe contener al menos una minúscula' })
      .refine((v) => /[0-9]/.test(v), { message: 'Debe contener al menos un número' }),
  })
  .refine(departmentRule.fn, departmentRule.opts);

// ─── edit: password opcional (vacío = no cambiar) ───
export const UserEditSchema = BaseUserSchema
  .extend({
    password: z.string()
      .refine((v) => v === '' || v.length >= 8,   { message: 'La contraseña debe tener al menos 8 caracteres' })
      .refine((v) => v === '' || /[A-Z]/.test(v), { message: 'Debe contener al menos una mayúscula' })
      .refine((v) => v === '' || /[a-z]/.test(v), { message: 'Debe contener al menos una minúscula' })
      .refine((v) => v === '' || /[0-9]/.test(v), { message: 'Debe contener al menos un número' }),
  })
  .refine(departmentRule.fn, departmentRule.opts);

// ─── tipos derivados ───
export type UserCreateFormData = z.infer<typeof UserCreateSchema>;
export type UserEditFormData   = z.infer<typeof UserEditSchema>;
