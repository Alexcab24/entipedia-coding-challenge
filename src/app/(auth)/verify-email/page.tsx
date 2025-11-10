import Link from 'next/link';
import { verifyEmail } from '@/lib/actions/auth/verify-email';

interface VerifyEmailPageProps {
  searchParams: Promise<{
    email?: string;
    status?: 'expired' | 'invalid' | 'error';
    token?: string;
  }>;
}

const statusMessages: Record<string, { title: string; description: string }> = {
  expired: {
    title: 'El enlace ha expirado',
    description:
      'Tu enlace de verificación ya no es válido. Solicita un nuevo correo de verificación desde la página de inicio de sesión.',
  },
  invalid: {
    title: 'Enlace inválido',
    description:
      'El enlace de verificación no es válido o ya fue utilizado. Solicita un nuevo correo desde la página de inicio de sesión.',
  },
  error: {
    title: 'Ocurrió un error',
    description:
      'Hubo un problema al verificar tu correo. Vuelve a intentarlo en unos minutos o contáctanos si el problema persiste.',
  },
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const { email, status, token } = params;
  const hasStatus = status && statusMessages[status];


  if (token && !hasStatus) {
    await verifyEmail(token);
    return null; 
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-lg p-8 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {hasStatus ? statusMessages[status as string].title : 'Confirma tu correo electrónico'}
          </h1>
          <p className="text-muted-foreground">
            {hasStatus
              ? statusMessages[status as string].description
              : `Hemos enviado un correo a ${email ?? 'tu bandeja de entrada'}. Da click en el enlace para activar tu cuenta.`}
          </p>
        </div>

        {!hasStatus && (
          <div className="rounded-xl bg-muted p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Si no encuentras el correo:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2 text-left">
              <li>Revisa la carpeta de spam o promociones.</li>
              <li>Asegúrate de que tu correo esté escrito correctamente.</li>
              <li>Espera unos minutos y vuelve a verificar.</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Regresar al inicio
          </Link>
          <Link
            href="/"
            className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            ¿Ya verificaste tu correo? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}


