import { z } from "zod";

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Debe contener al menos 8 caracteres'),
    confirmPassword: z
        .string()
        .min(8, 'Debe contener al menos 8 caracteres'),
    token: z
        .string()
        .min(1, 'Token de verificación requerido'),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    }
);

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

