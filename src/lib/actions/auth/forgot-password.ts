'use server';

import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from 'node:crypto';
import { forgotPasswordSchema } from "./schemas/forgot-password.schema";
import { sendResetPasswordEmail } from "@/lib/email/sendResetPasswordEmail";
import type { ForgotPasswordState } from "./forgot-password.types";

const RESET_TOKEN_TTL_HOURS = 1;

export async function forgotPassword(
    _prevState: ForgotPasswordState,
    formData: FormData,
): Promise<ForgotPasswordState> {
    const parsedResult = forgotPasswordSchema.safeParse({
        email: formData.get('email'),
    });

    if (!parsedResult.success) {
        const { fieldErrors } = parsedResult.error.flatten();
        return {
            status: 'error',
            message: fieldErrors.email?.[0] || 'Por favor, ingresa un correo válido.',
        };
    }

    const { email } = parsedResult.data;

    try {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);


        if (!user) {
            return {
                status: 'success',
                message: 'Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.',
            };
        }


        const resetToken = randomUUID();
        const resetTokenExpiresAt = new Date(
            Date.now() + RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000
        );


        await db
            .update(usersTable)
            .set({
                resetPasswordToken: resetToken,
                resetPasswordTokenExpiresAt: resetTokenExpiresAt,
            })
            .where(eq(usersTable.id, user.id));


        try {
            await sendResetPasswordEmail({
                email: user.email,
                name: user.name,
                token: resetToken,
            });
        } catch (emailError) {
            console.error("Failed to send reset password email:", emailError);

        }

        return {
            status: 'success',
            message: 'Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.',
        };
    } catch (error) {
        console.error("Failed to process forgot password:", error);
        return {
            status: 'error',
            message: 'Ocurrió un error al procesar tu solicitud. Intenta nuevamente.',
        };
    }
}

