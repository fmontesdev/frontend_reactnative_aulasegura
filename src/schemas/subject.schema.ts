/**
 * Schemas de validación para formularios de asignaturas usando Zod
 */

import { z } from 'zod';

// Schema unificado para CREAR y EDITAR asignatura
export const SubjectFormSchema = z.object({
  subjectCode: z.string().min(1, 'El código es obligatorio').max(50, 'El código es demasiado largo'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200, 'El nombre es demasiado largo'),
  departmentId: z.number({ required_error: 'El departamento es obligatorio' }),
  courseIds: z.array(z.number()).min(1, 'Debe seleccionar al menos un curso'),
});

export type SubjectFormData = z.infer<typeof SubjectFormSchema>;
