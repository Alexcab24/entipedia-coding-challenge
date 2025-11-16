'use server';

import { db } from '@/lib/db';
import {
    workspaceInvitationsTable,
    companiesTable,
    usersTable,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { randomUUID } from 'node:crypto';
import { sendWorkspaceInvitationEmail } from '@/lib/email/sendWorkspaceInvitationEmail';
import { canInviteUsers } from '@/lib/utils/workspace-permissions';
import { ResendInvitationResult } from '@/types/interfaces/invitation';

const INVITATION_EXPIRY_DAYS = 2;



export async function resendInvitation(
    invitationId: string
): Promise<ResendInvitationResult> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            success: false,
            message: 'Debes estar autenticado para reenviar invitaciones.',
        };
    }

    try {
        //buscar invitacion
        const [invitation] = await db
            .select({
                id: workspaceInvitationsTable.id,
                email: workspaceInvitationsTable.email,
                companyId: workspaceInvitationsTable.companyId,
                status: workspaceInvitationsTable.status,
            })
            .from(workspaceInvitationsTable)
            .where(eq(workspaceInvitationsTable.id, invitationId))
            .limit(1);

        if (!invitation) {
            return {
                success: false,
                message: 'Invitación no encontrada.',
            };
        }

        //verificar si tiene permisos para reenviar
        const hasPermission = await canInviteUsers(
            session.user.id,
            invitation.companyId
        );
        if (!hasPermission) {
            return {
                success: false,
                message: 'No tienes permisos para reenviar esta invitación.',
            };
        }

        //verificar si ya fue aceptada
        if (invitation.status === 'accepted') {
            return {
                success: false,
                message: 'No puedes reenviar una invitación que ya fue aceptada.',
            };
        }

        //buscar workspace
        const [company] = await db
            .select({
                id: companiesTable.id,
                name: companiesTable.name,
            })
            .from(companiesTable)
            .where(eq(companiesTable.id, invitation.companyId))
            .limit(1);

        if (!company) {
            return {
                success: false,
                message: 'Workspace no encontrado.',
            };
        }

        //buscar nombre del invitador
        const [inviter] = await db
            .select({
                name: usersTable.name,
            })
            .from(usersTable)
            .where(eq(usersTable.id, session.user.id))
            .limit(1);

        const inviterName = inviter?.name || 'Un usuario';

        //generar nuevo token y fecha de expiracion
        const newToken = randomUUID();
        const newExpiresAt = new Date(
            Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
        );

        // actualizar invitación
        await db
            .update(workspaceInvitationsTable)
            .set({
                token: newToken,
                expiresAt: newExpiresAt,
                status: 'pending',
            })
            .where(eq(workspaceInvitationsTable.id, invitationId));

        //enviar correo
        try {
            await sendWorkspaceInvitationEmail({
                email: invitation.email,
                workspaceName: company.name,
                inviterName,
                token: newToken,
            });

            return {
                success: true,
                message: 'Invitación reenviada exitosamente.',
            };
        } catch (emailError) {
            console.error('[resendInvitation] Email error:', emailError);
            return {
                success: false,
                message: 'No se pudo enviar el correo. Verifica tu configuración de email.',
            };
        }
    } catch (error) {
        console.error('[resendInvitation] Error:', error);
        return {
            success: false,
            message: 'Ocurrió un error al reenviar la invitación.',
        };
    }
}

