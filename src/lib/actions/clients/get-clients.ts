'use server';

import { db } from '@/lib/db';
import { clientsTable } from '@/lib/db/schema';
import { eq, sql, desc, or, ilike, and } from 'drizzle-orm';
import { auth } from '@/auth.config';

export interface Client {
    id: string;
    name: string;
    type: 'individual' | 'company';
    email: string;
    phone: string;
    value: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getClients(
    companyId: string,
    page: number = 1,
    pageSize: number = 10,
    query: string = ''
): Promise<{ clients: Client[]; total: number; totalPages: number }> {
    const session = await auth();

    if (!session?.user?.id) {
        return { clients: [], total: 0, totalPages: 0 };
    }

    try {
        const offset = (page - 1) * pageSize;

        // search conditions
        const companyCondition = eq(clientsTable.companyId, companyId);
        const whereClause = query
            ? and(
                companyCondition,
                or(
                    ilike(clientsTable.name, `%${query}%`),
                    ilike(clientsTable.email, `%${query}%`),
                    ilike(clientsTable.phone, `%${query}%`)
                )
            )
            : companyCondition;

        const [clients, totalResult] = await Promise.all([
            db
                .select()
                .from(clientsTable)
                .where(whereClause)
                .limit(pageSize)
                .offset(offset)
                .orderBy(desc(clientsTable.createdAt)),
            db
                .select({ count: sql<number>`count(*)::int` })
                .from(clientsTable)
                .where(whereClause),
        ]);

        const total = Number(totalResult[0]?.count || 0);
        const totalPages = Math.ceil(total / pageSize);

        const formattedClients: Client[] = clients.map((client) => ({
            id: client.id,
            name: client.name,
            type: client.type as 'individual' | 'company',
            email: client.email,
            phone: client.phone,
            value: client.value,
            dateFrom: client.dateFrom ? client.dateFrom.toString() : null,
            dateTo: client.dateTo ? client.dateTo.toString() : null,
            notes: client.notes,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }));

        return {
            clients: formattedClients,
            total,
            totalPages,
        };
    } catch (error) {
        console.error('[getClients] Failed to fetch clients:', error);
        return { clients: [], total: 0, totalPages: 0 };
    }
}

