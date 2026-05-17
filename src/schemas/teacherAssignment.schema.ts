import { z } from 'zod';

export const TeacherAssignmentFormSchema = z.object({
  teacherId: z.string().min(1, 'El profesor es obligatorio'),
  courseId: z.number({ required_error: 'El curso es obligatorio' }),
  subjectId: z.number({ required_error: 'La asignatura es obligatoria' }),
});

export type TeacherAssignmentFormData = z.infer<typeof TeacherAssignmentFormSchema>;
