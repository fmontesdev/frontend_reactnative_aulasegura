import { z } from 'zod';

export const ReaderFormSchema = z.object({
  readerCode: z.string()
    .min(1, 'El código es obligatorio')
    .max(50, 'El código no puede exceder 50 caracteres'),
  roomId: z.number({ required_error: 'Debe seleccionar un aula' })
    .int('Debe seleccionar un aula')
    .positive('Debe seleccionar un aula'),
});

export type ReaderFormData = z.infer<typeof ReaderFormSchema>;
