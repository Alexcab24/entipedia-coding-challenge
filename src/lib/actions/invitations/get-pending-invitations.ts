'use server';

import { db } from '@/lib/db';
import { workspaceInvitationsTable, usersTable } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { canInviteUsers } from '@/lib/utils/workspace-permissions';
import { PendingInvitation } from '@/types/interfaces/invitation';


export async function getPendingInvitations(
    companyId: string
): Promise<PendingInvitation[]> {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    //verificar si tiene permisos para invitar
    const hasPermission = await canInviteUsers(session.user.id, companyId);
    if (!hasPermission) {
        return [];
    }

    try {
        const invitations = await db
            .select({
                id: workspaceInvitationsTable.id,
                email: workspaceInvitationsTable.email,
                status: workspaceInvitationsTable.status,
                createdAt: workspaceInvitationsTable.createdAt,
                expiresAt: workspaceInvitationsTable.expiresAt,
                inviterName: usersTable.name,
            })
            .from(workspaceInvitationsTable)
            .innerJoin(
                usersTable,
                eq(workspaceInvitationsTable.invitedBy, usersTable.id)
            )
            .where(
                and(
                    eq(workspaceInvitationsTable.companyId, companyId),
                    eq(workspaceInvitationsTable.status, 'pending')
                )
            )
            .orderBy(workspaceInvitationsTable.createdAt);

        return invitations.map((inv) => ({
            id: inv.id,
            email: inv.email,
            status: inv.status,
            createdAt: inv.createdAt,
            expiresAt: inv.expiresAt,
            inviterName: inv.inviterName,
        }));
    } catch (error) {
        console.error('[getPendingInvitations] Error:', error);
        return [];
    }
}

