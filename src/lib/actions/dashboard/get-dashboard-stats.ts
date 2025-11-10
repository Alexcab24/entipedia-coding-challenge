'use server';

import { db } from '@/lib/db';
import {
    projectsTable,
    filesTable,
    userCompaniesTable,
} from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@/auth.config';

export interface DashboardStats {
    totalProjects: number;
    totalMembers: number;
    totalFiles: number;
}

export async function getDashboardStats(
    companyId: string
): Promise<DashboardStats> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            totalProjects: 0,
            totalMembers: 0,
            totalFiles: 0,
        };
    }

    try {

        const [projectsResult, membersResult, filesResult] = await Promise.all([

            db
                .select({ count: sql<number>`count(*)::int` })
                .from(projectsTable)
                .where(eq(projectsTable.companyId, companyId)),

            db
                .select({ count: sql<number>`count(*)::int` })
                .from(userCompaniesTable)
                .where(eq(userCompaniesTable.companyId, companyId)),

            db
                .select({ count: sql<number>`count(*)::int` })
                .from(filesTable)
                .where(eq(filesTable.companyId, companyId)),
        ]);

        return {
            totalProjects: Number(projectsResult[0]?.count || 0),
            totalMembers: Number(membersResult[0]?.count || 0),
            totalFiles: Number(filesResult[0]?.count || 0),
        };
    } catch (error) {
        console.error(
            '[getDashboardStats] Failed to fetch dashboard stats:',
            error
        );
        if (error instanceof Error) {
            console.error('[getDashboardStats] Error message:', error.message);
        }
        return {
            totalProjects: 0,
            totalMembers: 0,
            totalFiles: 0,
        };
    }
}

