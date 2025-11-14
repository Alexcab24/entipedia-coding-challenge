import { z } from 'zod';

export const uploadFileSchema = z
    .object({
        companyId: z.string().trim().min(1, 'La empresa es requerida'),
        name: z
            .string()
            .trim()
            .min(1, 'El nombre es requerido')
            .max(255, 'El nombre no puede exceder 255 caracteres'),
        type: z.enum(['pdf', 'image', 'video', 'audio', 'document', 'other'], {
            message: 'Tipo de archivo inválido',
        }),
        file: z
            .any()
            .optional()
            .refine(
                (file) => {
                    if (file) {
                        if (file instanceof File || (typeof file === 'object' && file !== null && 'size' in file && 'name' in file)) {
                            return file.size > 0;
                        }
                        return false;
                    }
                    return true;
                },
                { message: 'Debe ser un archivo válido y no puede estar vacío' }
            ),
        url: z
            .string()
            .trim()
            .optional()
            .refine(
                (url) => {
                    if (url && url.trim().length > 0) {
                        try {
                            new URL(url);
                            return url.startsWith('http://') || url.startsWith('https://');
                        } catch {
                            return false;
                        }
                    }
                    return true;
                },
                { message: 'Debe ser una URL válida (http:// o https://)' }
            ),
        description: z
            .string()
            .trim()
            .optional()
            .transform((value) => {
                if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                    return null;
                }
                return typeof value === 'string' ? value.trim() : null;
            }),
    })
    .refine(
        (data) => {
            const hasFile = data.file &&
                (data.file instanceof File || (typeof data.file === 'object' && data.file !== null && 'size' in data.file)) &&
                data.file.size > 0;
            const hasUrl = data.url && typeof data.url === 'string' && data.url.trim().length > 0;
            return hasFile || hasUrl;
        },
        {
            message: 'Debes proporcionar un archivo o una URL',
            path: ['file'],
        }
    )
    .refine(
        (data) => {
            const hasFile = data.file &&
                (data.file instanceof File || (typeof data.file === 'object' && data.file !== null && 'size' in data.file)) &&
                data.file.size > 0;
            const hasUrl = data.url && typeof data.url === 'string' && data.url.trim().length > 0;
            return !(hasFile && hasUrl);
        },
        {
            message: 'No puedes proporcionar un archivo y una URL al mismo tiempo',
            path: ['file'],
        }
    );

export type UploadFileSchema = z.infer<typeof uploadFileSchema>;

