import { z } from "zod";

export const updateCompanySchema = z.object({
    companyId: z.string().uuid('ID de compañía inválido'),
    name: z.string().trim().min(1, 'El nombre es requerido').max(255, 'El nombre no puede exceder 255 caracteres'),
    description: z.string().trim().optional().transform(val => val === '' ? undefined : val),
});