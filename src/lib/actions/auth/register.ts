'use server';

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import bcryptjs from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";
import type { RegisterActionState } from "./register.types";
import { registerSchema } from "./schemas/register.schema";

const VERIFICATION_TOKEN_TTL_HOURS = 24;

type PostgresError = {
    code?: string;
    message?: string;
};

const isUniqueConstraintError = (error: unknown) =>
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as PostgresError).code === '23505';

const buildErrorState = (
    overrides: Partial<RegisterActionState>,
    formData: FormData
): RegisterActionState => ({
    status: 'error',
    message: overrides.message ?? 'Revisa la información ingresada.',
    fieldErrors: overrides.fieldErrors ?? {},
    values: {
        fullName: formData.get('fullName')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        ...(overrides.values ?? {}),
    },
});

export const registerUser = async (
    _prevState: RegisterActionState,
    formData: FormData,
): Promise<RegisterActionState> => {
    const parsedResult = registerSchema.safeParse({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!parsedResult.success) {
        const { fieldErrors, formErrors } = parsedResult.error.flatten();
        return buildErrorState(
            {
                message: formErrors[0] ?? 'Por favor corrige los errores del formulario.',
                fieldErrors: {
                    fullName: fieldErrors.fullName?.[0],
                    email: fieldErrors.email?.[0],
                    password: fieldErrors.password?.[0],
                    confirmPassword: fieldErrors.confirmPassword?.[0],
                },
            },
            formData
        );
    }

    const { fullName, email, password } = parsedResult.data;

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = randomUUID();
    const verificationTokenExpiresAt = new Date(
        Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000
    );

    try {
        const [user] = await db.insert(usersTable).values({
            name: fullName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt,
        }).returning();

        try {
            await sendVerificationEmail({
                email,
                name: fullName,
                token: verificationToken,
            });
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);


            if (emailError instanceof Error) {
                console.error("Email error message:", emailError.message);
                console.error("Email error stack:", emailError.stack);
            }


            try {
                await db.delete(usersTable).where(eq(usersTable.id, user.id));
            } catch (deleteError) {
                console.error("Failed to delete user after email error:", deleteError);
            }


            const errorMessage = emailError instanceof Error
                ? emailError.message.includes('Gmail SMTP')
                    ? emailError.message
                    : 'No pudimos enviar el correo de verificación. Verifica tu configuración de Gmail SMTP (GMAIL_USER y GMAIL_APP_PASSWORD).'
                : 'No pudimos enviar el correo de verificación. Intenta nuevamente en unos minutos.';

            return buildErrorState(
                {
                    message: errorMessage,
                },
                formData
            );
        }

        redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {

        if (error && typeof error === 'object' && 'digest' in error &&
            typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        if (isUniqueConstraintError(error)) {
            return buildErrorState(
                {
                    message: 'Ya existe un usuario registrado con ese correo electrónico.',
                    fieldErrors: {
                        email: 'Este correo ya está registrado',
                    },
                },
                formData
            );
        }

        console.error("Failed to register user:", error);
        return buildErrorState(
            {
                message: 'Error al registrar el usuario. Intenta nuevamente.',
            },
            formData
        );
    }
};