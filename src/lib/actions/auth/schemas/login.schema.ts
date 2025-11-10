import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'El correo es obligatorio')
        .email('Correo electrónico inválido')
        .transform((value) => value.toLowerCase()),
    password: z
        .string()
        .min(1, 'La contraseña es obligatoria'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

