import { z } from 'zod';

const numericText = (fieldName: string) => z.string()
  .min(1, `${fieldName} es obligatorio`)
  .regex(/^\d+$/, `${fieldName} debe ser un número entero`);

export const RoomFormSchema = z.object({
  roomCode: z.string()
    .min(1, 'El código es obligatorio')
    .max(50, 'El código no puede exceder 50 caracteres'),
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  courseId: z.number().int().min(0).default(0),
  capacity: numericText('La capacidad'),
  building: numericText('El edificio'),
  floor: numericText('La planta'),
  readerIds: z.array(z.number()).default([]),
});

export type RoomFormData = z.infer<typeof RoomFormSchema>;
