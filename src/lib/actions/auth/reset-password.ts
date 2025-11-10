'use server';

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from 'bcryptjs';
import { resetPasswordSchema } from "./schemas/reset-password.schema";
import type { ResetPasswordState } from "./reset-password.types";

export async function resetPassword(
    _prevState: ResetPasswordState,
    formData: FormData,
): Promise<ResetPasswordState> {
    const parsedResult = resetPasswordSchema.safeParse({
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        token: formData.get('token'),
    });

    if (!parsedResult.success) {
        const { fieldErrors } = parsedResult.error.flatten();
        return {
            status: 'error',
            message: 'Por favor, corrige los errores del formulario.',
            fieldErrors: {
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            },
        };
    }

    const { password, token } = parsedResult.data;

    try {

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.resetPasswordToken, token))
            .limit(1);

        if (!user) {
            return {
                status: 'error',
                message: 'El enlace de restablecimiento no es válido o ha expirado.',
            };
        }


        if (user.resetPasswordTokenExpiresAt && user.resetPasswordTokenExpiresAt < new Date()) {
            return {
                status: 'error',
                message: 'El enlace de restablecimiento ha expirado. Solicita uno nuevo.',
            };
        }


        const hashedPassword = await bcryptjs.hash(password, 10);

        await db
            .update(usersTable)
            .set({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordTokenExpiresAt: null,
            })
            .where(eq(usersTable.id, user.id));

        redirect('/?reset=success');
    } catch (error) {
        if (error && typeof error === 'object' && 'digest' in error && 
            typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error("Failed to reset password:", error);
        return {
            status: 'error',
            message: 'Ocurrió un error al restablecer tu contraseña. Intenta nuevamente.',
        };
    }
}

