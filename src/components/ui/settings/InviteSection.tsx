'use client';

import { useState, useEffect, useActionState } from 'react';
import { Mail, Loader2, RefreshCw, Trash2, Info, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import Input from '../Input';
import Button from '../Button';
import { cn } from '@/lib/utils';
import { sendWorkspaceInvitations } from '@/lib/actions/invitations/send-workspace-invitations';
import { sendInvitationsInitialState } from '@/lib/actions/invitations/send-workspace-invitations.types';
import { getPendingInvitations } from '@/lib/actions/invitations/get-pending-invitations';
import { PendingInvitation } from '@/types/interfaces/invitation';
import { cancelInvitation } from '@/lib/actions/invitations/cancel-invitation';
import { resendInvitation } from '@/lib/actions/invitations/resend-invitation';
import { formatDateDisplay } from '@/lib/utils/date';

interface InviteSectionProps {
    companyId: string;
}

export default function InviteSection({ companyId }: InviteSectionProps) {
    const [inviteEmail, setInviteEmail] = useState('');
    const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
    const [loadingInvitations, setLoadingInvitations] = useState(false);
    const [state, formAction, isPending] = useActionState(
        sendWorkspaceInvitations,
        sendInvitationsInitialState
    );

    useEffect(() => {
        loadPendingInvitations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId]);

    const loadPendingInvitations = async () => {
        setLoadingInvitations(true);
        try {
            const invitations = await getPendingInvitations(companyId);
            setPendingInvitations(invitations);
        } catch (error) {
            console.error('Failed to load pending invitations:', error);
        } finally {
            setLoadingInvitations(false);
        }
    };

    const handleCancelInvitation = async (invitationId: string) => {
        const result = await cancelInvitation(invitationId);
        if (result.success) {
            await loadPendingInvitations();
        } else {
            alert(result.message);
        }
    };

    const handleResendInvitation = async (invitationId: string) => {
        const result = await resendInvitation(invitationId);
        if (result.success) {
            await loadPendingInvitations();
        } else {
            alert(result.message);
        }
    };

    useEffect(() => {
        if (state.status === 'success' && state.message) {
            setInviteEmail('');
            loadPendingInvitations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.status]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    Invitar Usuarios al Workspace
                </h3>
                <p className="text-sm text-muted-foreground">
                    Añade miembros a tu workspace invitándolos por correo electrónico
                </p>
            </div>

            <Card className="border-border/60">
                <CardContent className="p-6">
                    <form action={formAction} className="space-y-4">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Input
                                    id="invite-email"
                                    label="Correo Electrónico"
                                    type="email"
                                    name="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="usuario@ejemplo.com"
                                    icon={<Mail className="h-4 w-4" />}
                                    disabled={isPending}
                                />
                            </div>
                            <div className="flex items-end">
                                <input type="hidden" name="companyId" value={companyId} />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={!inviteEmail.trim() || isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <UserPlus className="h-4 w-4 mr-2" />
                                    )}
                                    Enviar Invitación
                                </Button>
                            </div>
                        </div>
                    </form>

                    {state.status === 'error' && state.message && (
                        <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                            {state.message}
                        </div>
                    )}

                    {state.status === 'success' && state.message && (
                        <div className="mt-4 rounded-lg border border-green-500/40 bg-green-50 p-3 text-sm text-green-900">
                            {state.message}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pending Invitations */}
            <Card className="border-border/60">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Invitaciones Pendientes</CardTitle>
                            <CardDescription>
                                Gestiona las invitaciones enviadas que aún no han sido aceptadas
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadPendingInvitations}
                            disabled={loadingInvitations}
                        >
                            <RefreshCw className={cn("h-4 w-4", loadingInvitations && "animate-spin")} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingInvitations ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : pendingInvitations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No hay invitaciones pendientes</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingInvitations.map((invitation) => {
                                const isExpired = invitation.expiresAt < new Date();
                                return (
                                    <div
                                        key={invitation.id}
                                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium text-foreground">
                                                    {invitation.email}
                                                </span>
                                                {isExpired && (
                                                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                                                        Expirada
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Invitado por {invitation.inviterName || 'Usuario'} •{' '}
                                                {formatDateDisplay(invitation.createdAt, {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleResendInvitation(invitation.id)}
                                                disabled={isExpired}
                                                title="Reenviar invitación"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCancelInvitation(invitation.id)}
                                                title="Cancelar invitación"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Sobre las invitaciones</p>
                    <p>
                        Los usuarios recibirán un correo electrónico con un enlace para unirse al workspace.
                        Las invitaciones expiran después de 7 días. Puedes reenviar o cancelar invitaciones pendientes.
                    </p>
                </div>
            </div>
        </div>
    );
}

