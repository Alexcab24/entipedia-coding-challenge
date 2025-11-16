import Link from 'next/link';
import { redirect } from 'next/navigation';
import { acceptInvitation } from '@/lib/actions/invitations/accept-invitation';
import { routes } from '@/router/routes';
import { AcceptInvitationPageProps } from '@/types/interfaces/invitation';



export default async function AcceptInvitationPage({
    searchParams,
}: AcceptInvitationPageProps) {
    const params = await searchParams;
    const { token } = params;

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-lg p-8 space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                            Invitación inválida
                        </h1>
                        <p className="text-muted-foreground">
                            No se proporcionó un token de invitación válido.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={routes.home}
                            className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Regresar al inicio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const result = await acceptInvitation(token);

    if (result.success && result.workspaceId) {
        redirect(`/workspaces`);
    }

    if (result.requiresRegistration) {
        redirect(`${routes.home}?register=true&invitation=${encodeURIComponent(token)}`);
    }

    if (result.requiresAuth) {
        redirect(`${routes.home}?login=true&invitation=${encodeURIComponent(token)}`);
    }


    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-lg p-8 space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        {result.message}
                    </h1>
                    <p className="text-muted-foreground">
                        {result.message.includes('expirado')
                            ? 'La invitación ha expirado. Contacta al administrador del workspace para una nueva invitación.'
                            : result.message.includes('cancelada')
                                ? 'Esta invitación fue cancelada. Contacta al administrador del workspace si necesitas acceso.'
                                : 'No se pudo procesar la invitación. Verifica que el enlace sea correcto.'}
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Link
                        href={routes.home}
                        className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Regresar al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}

