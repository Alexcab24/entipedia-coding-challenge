import { z } from "zod";

export const createProjectSchema = z.object({
    companyId: z
        .string()
        .uuid('ID de compañía inválido'),
    name: z
        .string()
        .trim()
        .min(1, 'El nombre es requerido')
        .max(255, 'El nombre no puede exceder 255 caracteres'),
    description: z
        .string()
        .trim()
        .nullable()
        .optional()
        .transform((value) => {
            if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                return null;
            }
            return typeof value === 'string' ? value.trim() : null;
        }),
    status: z.enum(['active', 'inactive', 'completed', 'cancelled']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const createProjectFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'completed', 'cancelled']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

export type CreateProjectFormData = z.infer<typeof createProjectFormSchema>;

