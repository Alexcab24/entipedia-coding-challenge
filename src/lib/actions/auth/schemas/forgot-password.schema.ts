import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'El correo es obligatorio')
        .email('Correo electrónico inválido')
        .transform((value) => value.toLowerCase()),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

