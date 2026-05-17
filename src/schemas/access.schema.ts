import { z } from 'zod';

const timeText = z.string()
  .min(1, 'La hora es obligatoria')
  .regex(/^\d{2}:\d{2}$/, 'Usa el formato HH:mm')
  .refine((value) => {
    const [hours, minutes] = value.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }, 'Introduce una hora válida');

const requiredNumericSelect = (message: string) => z.coerce.number().int().min(1, message);

const optionalNumericSelect = (message: string) => z.preprocess(
  (value) => (value === '' || value === undefined || value === null ? null : value),
  z.coerce.number().int().positive(message).nullable().optional(),
);

export const WeeklyScheduleFormSchema = z.object({
  dayOfWeek: requiredNumericSelect('Selecciona un día').max(7, 'Selecciona un día'),
  startTime: timeText,
  endTime: timeText,
}).refine((data) => data.startTime < data.endTime, {
  message: 'La hora de fin debe ser posterior a la de inicio',
  path: ['endTime'],
});

export type WeeklyScheduleFormData = z.infer<typeof WeeklyScheduleFormSchema>;

export const EventPermissionFormSchema = z.object({
  roomId: requiredNumericSelect('Selecciona un aula'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  startTime: timeText,
  endTime: timeText,
  description: z.string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(100, 'La descripción no puede superar 100 caracteres'),
}).refine((data) => data.startTime < data.endTime, {
  message: 'La hora de fin debe ser posterior a la de inicio',
  path: ['endTime'],
});

export type EventPermissionFormData = z.infer<typeof EventPermissionFormSchema>;

export const WeeklyPermissionFormSchema = z.object({
  roomId: requiredNumericSelect('Selecciona un aula'),
  assignmentId: optionalNumericSelect('Selecciona una asignación'),
});

export type WeeklyPermissionFormData = z.infer<typeof WeeklyPermissionFormSchema>;
