'use server';

import { db } from '@/lib/db';
import { clientsTable } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface RecentClient {
    id: string;
    name: string;
    email: string;
    type: string;
    createdAt: Date;
}

export async function getRecentClients(
    companyId: string,
    limit: number = 3
): Promise<RecentClient[]> {
    try {
        const clients = await db
            .select({
                id: clientsTable.id,
                name: clientsTable.name,
                email: clientsTable.email,
                type: clientsTable.type,
                createdAt: clientsTable.createdAt,
            })
            .from(clientsTable)
            .where(eq(clientsTable.companyId, companyId))
            .orderBy(desc(clientsTable.createdAt))
            .limit(limit);

        return clients;
    } catch (error) {
        console.error('[getRecentClients] Error:', error);
        return [];
    }
}

