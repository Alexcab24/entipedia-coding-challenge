import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, 'Debe contener al menos 3 caracteres'),
    email: z
        .string()
        .trim()
        .min(1, 'El correo es obligatorio')
        .email('Correo electrónico inválido')
        .transform((value) => value.toLowerCase()),
    password: z
        .string()
        .min(8, 'Debe contener al menos 8 caracteres'),
    confirmPassword: z
        .string()
        .min(8, 'Debe contener al menos 8 caracteres'),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    }
);

export type RegisterSchema = z.infer<typeof registerSchema>;

