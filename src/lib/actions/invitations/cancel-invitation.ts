'use server';

import { db } from '@/lib/db';
import { workspaceInvitationsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { canInviteUsers } from '@/lib/utils/workspace-permissions';
import { CancelInvitationResult } from '@/types/interfaces/invitation';


export async function cancelInvitation(
    invitationId: string
): Promise<CancelInvitationResult> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            success: false,
            message: 'Debes estar autenticado para cancelar invitaciones.',
        };
    }

    try {

        const [invitation] = await db
            .select({
                id: workspaceInvitationsTable.id,
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

        //verificar si tiene permisos para cancelar
        const hasPermission = await canInviteUsers(
            session.user.id,
            invitation.companyId
        );
        if (!hasPermission) {
            return {
                success: false,
                message: 'No tienes permisos para cancelar esta invitación.',
            };
        }

        //verificar si ya fue aceptada o cancelada
        if (invitation.status === 'accepted') {
            return {
                success: false,
                message: 'No puedes cancelar una invitación que ya fue aceptada.',
            };
        }

        if (invitation.status === 'cancelled') {
            return {
                success: false,
                message: 'Esta invitación ya está cancelada.',
            };
        }

        //cancelar invitacion
        await db
            .update(workspaceInvitationsTable)
            .set({ status: 'cancelled' })
            .where(eq(workspaceInvitationsTable.id, invitationId));

        return {
            success: true,
            message: 'Invitación cancelada exitosamente.',
        };
    } catch (error) {
        console.error('[cancelInvitation] Error:', error);
        return {
            success: false,
            message: 'Ocurrió un error al cancelar la invitación.',
        };
    }
}

