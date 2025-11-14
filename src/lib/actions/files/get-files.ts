'use server';

import { auth } from "@/auth.config";
import { db } from "@/lib/db";
import { filesTable } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export type FileType = 'pdf' | 'image' | 'video' | 'audio' | 'document' | 'other';

export interface File {
    id: string;
    name: string;
    description: string | null;
    type: FileType;
    url: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function getFiles(
    companyId: string,
    page: number = 1,
    pageSize: number = 10
): Promise<{ files: File[]; total: number; totalPages: number }> {
    const session = await auth();

    if (!session?.user?.id) {
        return { files: [], total: 0, totalPages: 0 };
    }

    try {
        const offset = (page - 1) * pageSize;

        const [files, totalResult] = await Promise.all([
            db
                .select()
                .from(filesTable)
                .where(eq(filesTable.companyId, companyId))
                .limit(pageSize)
                .offset(offset)
                .orderBy(desc(filesTable.createdAt)),
            db
                .select({ count: sql<number>`count(*)::int` })
                .from(filesTable)
                .where(eq(filesTable.companyId, companyId)),
        ]);

        const total = Number(totalResult[0]?.count || 0);
        const totalPages = Math.ceil(total / pageSize);

        const formattedFiles: File[] = files.map((file) => ({
            id: file.id,
            name: file.name,
            description: file.description,
            type: file.type as 'pdf' | 'image' | 'video' | 'audio' | 'document' | 'other',
            url: file.url,
            companyId: file.companyId,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
        }));

        return {
            files: formattedFiles,
            total,
            totalPages,
        };
    } catch (error) {
        console.error('[getFiles] Failed to fetch files:', error);
        return { files: [], total: 0, totalPages: 0 };
    }
}