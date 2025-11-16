'use server';

import { db } from '@/lib/db';
import { userCompaniesTable } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export type WorkspaceRole = 'owner' | 'admin' | 'member';


export async function getUserWorkspaceRole(
    userId: string,
    companyId: string
): Promise<WorkspaceRole | null> {
    try {
        const [userCompany] = await db
            .select({
                role: userCompaniesTable.role,
            })
            .from(userCompaniesTable)
            .where(
                and(
                    eq(userCompaniesTable.userId, userId),
                    eq(userCompaniesTable.companyId, companyId)
                )
            )
            .limit(1);

        return userCompany?.role || null;
    } catch (error) {
        console.error('[getUserWorkspaceRole] Error:', error);
        return null;
    }
}

//usuario puede invitar 
export async function canInviteUsers(
    userId: string,
    companyId: string
): Promise<boolean> {
    const role = await getUserWorkspaceRole(userId, companyId);
    return role === 'owner' || role === 'admin';
}

//usuario no puede invitar a otros
export async function isWorkspaceMember(
    userId: string,
    companyId: string
): Promise<boolean> {
    const role = await getUserWorkspaceRole(userId, companyId);
    return role !== null;
}

