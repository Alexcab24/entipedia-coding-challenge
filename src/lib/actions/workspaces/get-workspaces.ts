'use server';

import { db } from '@/lib/db';
import { companiesTable, userCompaniesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';

export interface Workspace {
    id: string;
    name: string;
    workspace: string;
    description?: string | null;
    role: 'owner' | 'admin' | 'member';
    createdAt: Date;
    updatedAt: Date;
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    try {
        const workspaces = await db
            .select({
                id: companiesTable.id,
                name: companiesTable.name,
                workspace: companiesTable.workspace,
                description: companiesTable.description,
                createdAt: companiesTable.createdAt,
                updatedAt: companiesTable.updatedAt,
            })
            .from(companiesTable)
            .innerJoin(
                userCompaniesTable,
                eq(companiesTable.id, userCompaniesTable.companyId)
            )
            .where(eq(userCompaniesTable.userId, session.user.id));



        const result = workspaces.map((ws) => ({
            id: ws.id,
            name: ws.name,
            workspace: ws.workspace,
            description: ws.description,
            role: 'owner' as const,
            createdAt: ws.createdAt,
            updatedAt: ws.updatedAt,
        }));

        return result;
    } catch (error) {
        console.error('[getUserWorkspaces] Failed to fetch user workspaces:', error);
        if (error instanceof Error) {
            console.error('[getUserWorkspaces] Error message:', error.message);
            console.error('[getUserWorkspaces] Error stack:', error.stack);
        }
        return [];
    }
}

