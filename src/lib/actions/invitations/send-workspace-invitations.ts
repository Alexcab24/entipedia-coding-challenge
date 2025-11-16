'use server';

import { db } from '@/lib/db';
import {
    companiesTable,
    userCompaniesTable,
    usersTable,
    workspaceInvitationsTable,
} from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { randomUUID } from 'node:crypto';
import { sendWorkspaceInvitationEmail } from '@/lib/email/sendWorkspaceInvitationEmail';
import { canInviteUsers } from '@/lib/utils/workspace-permissions';
import type { SendInvitationsState } from './send-workspace-invitations.types';
import { sendInvitationSchema } from './schema/send-workspace-invitacion';

const INVITATION_EXPIRY_DAYS = 2;


export async function sendWorkspaceInvitations(
    _prevState: SendInvitationsState | undefined,
    formData: FormData
): Promise<SendInvitationsState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'Debes estar autenticado para enviar invitaciones.',
        };
    }

    const userId = session.user.id;

    const email = formData.get('email');
    const companyId = formData.get('companyId');

    if (!email || !companyId) {
        return {
            status: 'error',
            message: 'Faltan datos requeridos.',
        };
    }

    const validation = sendInvitationSchema.safeParse({
        email: email.toString().trim(),
        companyId: companyId.toString(),
    });

    if (!validation.success) {
        return {
            status: 'error',
            message: validation.error.issues[0]?.message || 'Datos inválidos',
        };
    }

    const { email: validEmail, companyId: validCompanyId } = validation.data;
    const normalizedEmail = validEmail.toLowerCase();

    //verificar si tiene permisos para invitar
    const hasPermission = await canInviteUsers(userId, validCompanyId);
    if (!hasPermission) {
        return {
            status: 'error',
            message: 'No tienes permisos para invitar usuarios a este workspace.',
        };
    }


    const [company] = await db
        .select({
            id: companiesTable.id,
            name: companiesTable.name,
        })
        .from(companiesTable)
        .where(eq(companiesTable.id, validCompanyId))
        .limit(1);

    if (!company) {
        return {
            status: 'error',
            message: 'Workspace no encontrado.',
        };
    }


    const [inviter] = await db
        .select({
            name: usersTable.name,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

    const inviterName = inviter?.name || 'Un usuario';


    const [existingMember] = await db
        .select({
            userId: usersTable.id,
        })
        .from(usersTable)
        .innerJoin(
            userCompaniesTable,
            eq(usersTable.id, userCompaniesTable.userId)
        )
        .where(
            and(
                eq(usersTable.email, normalizedEmail),
                eq(userCompaniesTable.companyId, validCompanyId)
            )
        )
        .limit(1);

    if (existingMember) {
        return {
            status: 'error',
            message: 'Este usuario ya es miembro del workspace.',
        };
    }


    const [pendingInvitation] = await db
        .select({
            id: workspaceInvitationsTable.id,
        })
        .from(workspaceInvitationsTable)
        .where(
            and(
                eq(workspaceInvitationsTable.email, normalizedEmail),
                eq(workspaceInvitationsTable.companyId, validCompanyId),
                eq(workspaceInvitationsTable.status, 'pending')
            )
        )
        .limit(1);

    if (pendingInvitation) {
        return {
            status: 'error',
            message: 'Ya existe una invitación pendiente para este correo.',
        };
    }

    // Crear invitación
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    try {
        await db.insert(workspaceInvitationsTable).values({
            email: normalizedEmail,
            companyId: validCompanyId,
            invitedBy: userId,
            token,
            status: 'pending',
            expiresAt,
        });

        // Enviar email
        try {
            await sendWorkspaceInvitationEmail({
                email: normalizedEmail,
                workspaceName: company.name,
                inviterName,
                token,
            });

            return {
                status: 'success',
                message: 'Invitación enviada exitosamente.',
                sentCount: 1,
            };
        } catch (emailError) {
            console.error('Failed to send invitation email:', emailError);
            await db
                .update(workspaceInvitationsTable)
                .set({ status: 'cancelled' })
                .where(eq(workspaceInvitationsTable.token, token));

            return {
                status: 'error',
                message: 'No se pudo enviar el correo de invitación. Verifica tu configuración de email.',
            };
        }
    } catch (error) {
        console.error('[sendWorkspaceInvitations] Error:', error);
        return {
            status: 'error',
            message: 'Ocurrió un error al enviar las invitaciones. Intenta nuevamente.',
        };
    }
}

