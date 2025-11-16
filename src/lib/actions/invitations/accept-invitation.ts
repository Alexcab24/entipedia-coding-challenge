'use server';

import { db } from '@/lib/db';
import {
    workspaceInvitationsTable,
    usersTable,
    userCompaniesTable,
    companiesTable,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { isWorkspaceMember } from '@/lib/utils/workspace-permissions';
import { AcceptInvitationResult } from '@/types/interfaces/invitation';



export async function acceptInvitation(
    token: string
): Promise<AcceptInvitationResult> {
    if (!token) {
        return {
            success: false,
            message: 'Token de invitación no proporcionado.',
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
                expiresAt: workspaceInvitationsTable.expiresAt,
            })
            .from(workspaceInvitationsTable)
            .where(eq(workspaceInvitationsTable.token, token))
            .limit(1);

        if (!invitation) {
            return {
                success: false,
                message: 'Invitación no encontrada o inválida.',
            };
        }

        //verificar si ya fue aceptada
        if (invitation.status === 'accepted') {
            return {
                success: false,
                message: 'Esta invitación ya fue aceptada.',
            };
        }

        //verificar si fue cancelada
        if (invitation.status === 'cancelled') {
            return {
                success: false,
                message: 'Esta invitación fue cancelada.',
            };
        }

        //verificar si expiro
        if (invitation.expiresAt < new Date()) {

            await db
                .update(workspaceInvitationsTable)
                .set({ status: 'expired' })
                .where(eq(workspaceInvitationsTable.id, invitation.id));

            return {
                success: false,
                message: 'Esta invitación ha expirado.',
            };
        }


        if (invitation.status !== 'pending') {
            return {
                success: false,
                message: 'Esta invitación no está disponible.',
            };
        }

        //verificar si el usuario existe 
        const session = await auth();

        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                emailVerifiedAt: usersTable.emailVerifiedAt,
            })
            .from(usersTable)
            .where(eq(usersTable.email, invitation.email.toLowerCase()))
            .limit(1);


        if (!user) {
            return {
                success: false,
                message: 'Debes registrarte primero para aceptar la invitación.',
                requiresRegistration: true,
            };
        }


        if (!session?.user?.id) {
            return {
                success: false,
                message: 'Debes iniciar sesión para aceptar la invitación.',
                requiresAuth: true,
            };
        }

        if (session.user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
            return {
                success: false,
                message: 'Esta invitación es para otro correo electrónico. Inicia sesión con el correo correcto.',
                requiresAuth: true,
            };
        }


        if (!user.emailVerifiedAt) {
            return {
                success: false,
                message: 'Debes verificar tu correo electrónico antes de aceptar la invitación.',
            };
        }

        const isMember = await isWorkspaceMember(user.id, invitation.companyId);
        if (isMember) {
            console.log('[acceptInvitation] User is already a member, marking invitation as accepted');
            await db
                .update(workspaceInvitationsTable)
                .set({
                    status: 'accepted',
                    acceptedAt: new Date(),
                })
                .where(eq(workspaceInvitationsTable.id, invitation.id));

            const [workspace] = await db
                .select({
                    id: companiesTable.id,
                    name: companiesTable.name,
                    workspace: companiesTable.workspace,
                })
                .from(companiesTable)
                .where(eq(companiesTable.id, invitation.companyId))
                .limit(1);

            return {
                success: true,
                message: 'Ya eres miembro de este workspace.',
                workspaceId: workspace?.id,
                workspaceName: workspace?.name,
            };
        }

  

        try {
            await db.insert(userCompaniesTable).values({
                userId: user.id,
                companyId: invitation.companyId,
                role: 'member',
            });
        } catch (insertError) {
            console.error('[acceptInvitation] Error:', insertError);
            return {
                success: false,
                message: 'Ocurrió un error al aceptar la invitación. Intenta nuevamente.',
            };
        }


        await db
            .update(workspaceInvitationsTable)
            .set({
                status: 'accepted',
                acceptedAt: new Date(),
            })
            .where(eq(workspaceInvitationsTable.id, invitation.id));

        const [workspace] = await db
            .select({
                id: companiesTable.id,
                name: companiesTable.name,
                workspace: companiesTable.workspace,
            })
            .from(companiesTable)
            .where(eq(companiesTable.id, invitation.companyId))
            .limit(1);


        return {
            success: true,
            message: 'Invitación aceptada exitosamente.',
            workspaceId: workspace?.id,
            workspaceName: workspace?.name,
        };
    } catch (error) {
        console.error('[acceptInvitation] Error:', error);
        return {
            success: false,
            message: 'Ocurrió un error al aceptar la invitación. Intenta nuevamente.',
        };
    }
}

