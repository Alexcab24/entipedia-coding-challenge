import { z } from "zod";

export const createClientSchema = z.object({
    companyId: z
        .string()
        .uuid('ID de compañía inválido'),
    name: z
        .string()
        .trim()
        .min(1, 'El nombre es requerido')
        .max(255, 'El nombre no puede exceder 255 caracteres'),
    type: z.enum(['individual', 'company']),
    email: z
        .string()
        .trim()
        .min(1, 'El email es requerido')
        .email('Email inválido')
        .max(255, 'El email no puede exceder 255 caracteres')
        .transform((value) => value.toLowerCase()),
    phone: z
        .string()
        .trim()
        .min(1, 'El teléfono es requerido')
        .max(255, 'El teléfono no puede exceder 255 caracteres')
        .regex(/^[\d\s\-\+\(\)]+$/, 'Formato de teléfono inválido'),
    value: z
        .string()
        .trim()
        .optional()
        .transform((value) => {
            if (!value || value.trim().length === 0) {
                return null;
            }
            const numericValue = typeof value === 'string' ? value.trim().replace(/[^\d.,]/g, '').replace(',', '.') : null;
            return numericValue || null;
        }),
    dateFrom: z
        .string()
        .trim()
        .optional()
        .transform((value) => {
            if (!value || value.trim().length === 0) {
                return null;
            }
            return value.trim();
        }),
    dateTo: z
        .string()
        .trim()
        .optional()
        .transform((value) => {
            if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                return null;
            }
            return typeof value === 'string' ? value.trim() : null;
        }),
    notes: z
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
});

export type CreateClientSchema = z.infer<typeof createClientSchema>;




export const createClientFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    type: z.enum(['individual', 'company']),
    email: z.string().email('Email inválido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    value: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    notes: z.string().optional(),
});

export type CreateClientFormData = z.infer<typeof createClientFormSchema>;


