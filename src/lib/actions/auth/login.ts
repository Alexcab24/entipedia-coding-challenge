'use server';

import { signIn } from '../../../auth.config';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false,
        });

        return 'Success';

    } catch (error) {
        if (error instanceof Error && error.message === 'Email not verified') {
            return 'EMAIL_NOT_VERIFIED';
        }

        if (error instanceof AuthError) {
            const errorMessage = error.message || '';
            const errorCause = error.cause?.toString() || '';

            if (errorMessage.includes('Email not verified') || errorCause.includes('Email not verified')) {
                return 'EMAIL_NOT_VERIFIED';
            }

            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Las credenciales son incorrectas. Verifica tu correo y contraseña.';
                default:
                    return 'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.';
            }
        }

        throw error;
    }
}