'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '@/lib/actions/auth/forgot-password';
import { forgotPasswordInitialState } from '@/lib/actions/auth/forgot-password.types';

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full cursor-pointer hover:bg-primary/90 transition-all duration-200"
            disabled={pending}
        >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar enlace de recuperación'}
        </Button>
    );
};

export default function ForgotPasswordForm() {
    const [state, formAction] = useActionState(forgotPassword, forgotPasswordInitialState);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    Recuperar contraseña
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                {state.status === 'success' && (
                    <div className="rounded-lg border border-green-500/40 bg-green-50 p-4 text-sm text-green-900">
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <div>
                                <p className="font-medium mb-1">Correo enviado</p>
                                <p>{state.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {state.status === 'error' && state.message && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                        <div className="flex items-start gap-2">
                            <span className="text-destructive font-semibold">•</span>
                            <div>
                                <p className="font-medium mb-1">Error</p>
                                <p>{state.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <Input
                    id="email"
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    icon={<Mail className="h-5 w-5" />}
                    required
                />

                <SubmitButton />
            </form>

            <div className="mt-6 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
}

