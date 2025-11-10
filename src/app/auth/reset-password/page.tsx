import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Link from 'next/link';

interface ResetPasswordPageProps {
    searchParams: Promise<{
        token?: string;
    }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { token } = await searchParams;

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-border/50 rounded-2xl shadow-2xl p-6 lg:p-10 backdrop-blur-sm text-center">
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                            Enlace inválido
                        </h1>
                        <p className="text-sm text-muted-foreground mb-6">
                            El enlace de restablecimiento no es válido o ha expirado.
                        </p>
                        <Link
                            href="/auth/forgot-password"
                            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                            Solicitar nuevo enlace
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border/50 rounded-2xl shadow-2xl p-6 lg:p-10 backdrop-blur-sm">
                    <ResetPasswordForm token={token} />
                </div>
            </div>
        </div>
    );
}

