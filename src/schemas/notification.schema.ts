import { z } from 'zod';
import { NotificationType } from '../types/Notification';
import { RoleName } from '../types/User';

const NotificationTargetSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('user'),
    userId: z.string().min(1, 'Debe seleccionar un usuario'),
    roleName: z.string().optional(),
  }),
  z.object({
    mode: z.literal('role'),
    userId: z.string().optional(),
    roleName: z.nativeEnum(RoleName, { message: 'Debe seleccionar un rol' }),
  }),
  z.object({
    mode: z.literal('all'),
    userId: z.string().optional(),
    roleName: z.string().optional(),
  }),
]);

export const NotificationCreateSchema = z.object({
  type: z.enum(['access', 'warning', 'info'] satisfies [NotificationType, NotificationType, NotificationType]),
  title: z.string().trim().min(1, 'El título es obligatorio').max(100, 'Máximo 100 caracteres'),
  body: z.string().trim().min(1, 'El mensaje es obligatorio').max(255, 'Máximo 255 caracteres'),
  target: NotificationTargetSchema,
});

export type NotificationCreateFormData = z.infer<typeof NotificationCreateSchema>;
