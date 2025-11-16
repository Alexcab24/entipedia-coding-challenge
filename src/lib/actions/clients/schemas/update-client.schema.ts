import { z } from "zod";


export const updateClientFieldSchema = z.object({
    clientId: z
        .string()
        .uuid('ID de cliente inválido'),
    field: z
        .enum(['name', 'type', 'email', 'phone', 'value', 'dateFrom', 'dateTo', 'notes']),
    value: z
        .string()
        .nullable()
        .optional(),
});


export const updateClientNameSchema = z
    .string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres');

export const updateClientTypeSchema = z.enum(['individual', 'company']);

export const updateClientEmailSchema = z
    .string()
    .trim()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres')
    .transform((value) => value.toLowerCase());

export const updateClientPhoneSchema = z
    .string()
    .trim()
    .min(1, 'El teléfono es requerido')
    .max(255, 'El teléfono no puede exceder 255 caracteres')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Formato de teléfono inválido');

export const updateClientValueSchema = z
    .string()
    .nullable()
    .optional()
    .transform((value) => {
        if (!value || value.trim().length === 0) {
            return null;
        }

        const numericValue = value.trim().replace(/[^\d.,]/g, '').replace(',', '.');
        return numericValue || null;
    });

export const updateClientDateSchema = z
    .string()
    .nullable()
    .optional()
    .transform((value) => {
        if (!value || value === null || value.trim().length === 0) {
            return null;
        }
        return value.trim();
    });

export const updateClientNotesSchema = z
    .string()
    .nullable()
    .optional()
    .transform((value) => {
        if (!value || value === null || value === '' || value.trim().length === 0) {
            return null;
        }
        return value.trim();
    });


export function validateClientFieldUpdate(
    field: string,
    value: string | null
): { success: boolean; data?: string | null; error?: string } {
    switch (field) {
        case 'name':
            if (!value || value.trim().length === 0) {
                return { success: false, error: 'El nombre es requerido' };
            }
            const nameResult = updateClientNameSchema.safeParse(value);
            if (!nameResult.success) {
                return {
                    success: false,
                    error: nameResult.error.issues[0]?.message || 'Nombre inválido'
                };
            }
            return { success: true, data: nameResult.data };

        case 'type':
            if (!value) {
                return { success: false, error: 'El tipo es requerido' };
            }
            const typeResult = updateClientTypeSchema.safeParse(value);
            if (!typeResult.success) {
                const errorMessage = typeResult.error.issues[0]?.message || 'El tipo debe ser individual o company';
                return {
                    success: false,
                    error: errorMessage
                };
            }
            return { success: true, data: typeResult.data };

        case 'email':
            if (!value || value.trim().length === 0) {
                return { success: false, error: 'El email es requerido' };
            }
            const emailResult = updateClientEmailSchema.safeParse(value);
            if (!emailResult.success) {
                return {
                    success: false,
                    error: emailResult.error.issues[0]?.message || 'Email inválido'
                };
            }
            return { success: true, data: emailResult.data };

        case 'phone':
            if (!value || value.trim().length === 0) {
                return { success: false, error: 'El teléfono es requerido' };
            }
            const phoneResult = updateClientPhoneSchema.safeParse(value);
            if (!phoneResult.success) {
                return {
                    success: false,
                    error: phoneResult.error.issues[0]?.message || 'Teléfono inválido'
                };
            }
            return { success: true, data: phoneResult.data };

        case 'value':
            const valueResult = updateClientValueSchema.safeParse(value);
            if (!valueResult.success) {
                return {
                    success: false,
                    error: valueResult.error.issues[0]?.message || 'Valor inválido'
                };
            }
            return { success: true, data: valueResult.data };

        case 'dateFrom':
        case 'dateTo':
            const dateResult = updateClientDateSchema.safeParse(value);
            if (!dateResult.success) {
                return {
                    success: false,
                    error: dateResult.error.issues[0]?.message || 'Fecha inválida'
                };
            }
            return { success: true, data: dateResult.data };

        case 'notes':
            const notesResult = updateClientNotesSchema.safeParse(value);
            if (!notesResult.success) {
                return {
                    success: false,
                    error: notesResult.error.issues[0]?.message || 'Notas inválidas'
                };
            }
            return { success: true, data: notesResult.data };

        default:
            return { success: false, error: 'Campo inválido' };
    }
}

export type UpdateClientFieldSchema = z.infer<typeof updateClientFieldSchema>;
