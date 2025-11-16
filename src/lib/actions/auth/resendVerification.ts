'use server';

import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from 'node:crypto';
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";

const VERIFICATION_TOKEN_TTL_HOURS = 24;

export async function resendVerificationEmail(email: string) {
    try {
        const normalizedEmail = email.trim().toLowerCase();

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail))
            .limit(1);

        if (!user) {
            return {
                ok: false,
                message: 'No encontramos una cuenta con ese correo electrónico.',
            };
        }

        if (user.emailVerifiedAt) {
            return {
                ok: false,
                message: 'Tu correo electrónico ya está verificado. Puedes iniciar sesión normalmente.',
            };
        }

        const verificationToken = randomUUID();
        const verificationTokenExpiresAt = new Date(
            Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000
        );


        await db
            .update(usersTable)
            .set({
                verificationToken,
                verificationTokenExpiresAt,
            })
            .where(eq(usersTable.id, user.id));


        try {
            await sendVerificationEmail({
                email: normalizedEmail,
                name: user.name,
                token: verificationToken,
            });

            return {
                ok: true,
                message: 'Correo de verificación reenviado. Revisa tu bandeja de entrada.',
            };
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            return {
                ok: false,
                message: 'No pudimos enviar el correo de verificación. Intenta nuevamente en unos minutos.',
            };
        }
    } catch (error) {
        console.error("Failed to resend verification email:", error);
        return {
            ok: false,
            message: 'Ocurrió un error al reenviar el correo. Intenta nuevamente.',
        };
    }
}

