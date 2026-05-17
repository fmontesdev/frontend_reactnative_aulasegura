import { z } from 'zod';

export const PhysicalTagFormSchema = z.object({
  userId: z.string().min(1, 'Debe seleccionar un usuario'),
  rawUid: z.string().min(1, 'El UID físico es obligatorio'),
});

export const MobileTagFormSchema = z.object({
  userId: z.string().min(1, 'Debe seleccionar un usuario'),
});

export const RegenerateTagFormSchema = z.object({
  rawUid: z.string().min(1, 'El nuevo UID físico es obligatorio'),
});

export type PhysicalTagFormData = z.infer<typeof PhysicalTagFormSchema>;
export type MobileTagFormData = z.infer<typeof MobileTagFormSchema>;
export type RegenerateTagFormData = z.infer<typeof RegenerateTagFormSchema>;
