import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(255, 'El nombre no puede exceder 255 caracteres'),
    workspace: z
        .string()
        .trim()
        .min(2, 'El nombre del espacio de trabajo debe tener al menos 2 caracteres')
        .max(255, 'El nombre del espacio de trabajo no puede exceder 255 caracteres')
        .regex(/^[a-z0-9-]+$/, 'El nombre del espacio de trabajo solo puede contener letras minúsculas, números y guiones')
        .transform((value) => value.toLowerCase().trim()),
    email: z
        .string()
        .trim()
        .min(1, 'El correo es obligatorio')
        .email('Correo electrónico inválido')
        .transform((value) => value.toLowerCase()),
    phone: z
        .string()
        .trim()
        .min(1, 'El teléfono es obligatorio')
        .regex(/^[\d\s\-\+\(\)]+$/, 'Formato de teléfono inválido'),
    description: z
        .string()
        .trim()
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .optional(),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

