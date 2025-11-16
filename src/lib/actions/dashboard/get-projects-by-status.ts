'use server';

import { db } from '@/lib/db';
import { projectsTable } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export interface ProjectStatusData {
    status: string;
    count: number;
}

export async function getProjectsByStatus(
    companyId: string
): Promise<ProjectStatusData[]> {
    try {
        const results = await db
            .select({
                status: projectsTable.status,
                count: sql<number>`count(*)::int`,
            })
            .from(projectsTable)
            .where(eq(projectsTable.companyId, companyId))
            .groupBy(projectsTable.status);


        const statusMap = new Map<string, number>();
        const allStatuses = ['active', 'inactive', 'completed', 'cancelled'];


        allStatuses.forEach(status => {
            statusMap.set(status, 0);
        });


        results.forEach(result => {
            statusMap.set(result.status, Number(result.count || 0));
        });

        //convertidor a español
        const statusLabels: Record<string, string> = {
            active: 'Activos',
            inactive: 'Inactivos',
            completed: 'Completados',
            cancelled: 'Cancelados',
        };

        return Array.from(statusMap.entries()).map(([status, count]) => ({
            status: statusLabels[status] || status,
            count,
        }));
    } catch (error) {
        console.error('[getProjectsByStatus] Error:', error);
        return [];
    }
}

