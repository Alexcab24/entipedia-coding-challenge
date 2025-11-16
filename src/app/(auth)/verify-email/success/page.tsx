'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const invitationToken = searchParams.get('invitation');

  useEffect(() => {
    if (invitationToken) {
      router.push(`/accept-invitation?token=${encodeURIComponent(invitationToken)}`);
    }
  }, [invitationToken, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-lg p-8 space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            ¡Correo verificado!
          </h1>
          <p className="text-muted-foreground">
            {email
              ? `Tu correo ${email} ha sido confirmado correctamente. Ya puedes iniciar sesión en Entipedia.`
              : 'Tu correo ha sido confirmado correctamente. Ya puedes iniciar sesión en Entipedia.'}
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    </div>
  );
}


