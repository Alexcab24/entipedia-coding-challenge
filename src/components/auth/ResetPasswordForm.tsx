'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '@/lib/actions/auth/reset-password';
import { resetPasswordInitialState } from '@/lib/actions/auth/reset-password.types';

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
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Restablecer contraseña'}
        </Button>
    );
};

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const [state, formAction] = useActionState(resetPassword, resetPasswordInitialState);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    Nueva contraseña
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tu nueva contraseña
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                <input type="hidden" name="token" value={token} />

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
                    id="password"
                    name="password"
                    label="Nueva contraseña"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    icon={<Lock className="h-5 w-5" />}
                    error={state.fieldErrors?.password}
                    showPasswordToggle
                    required
                />

                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirmar nueva contraseña"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    icon={<Lock className="h-5 w-5" />}
                    error={state.fieldErrors?.confirmPassword}
                    showPasswordToggle
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

