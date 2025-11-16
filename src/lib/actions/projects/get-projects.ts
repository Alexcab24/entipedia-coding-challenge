'use server';

import { db } from '@/lib/db';
import { projectsTable } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth.config';

export type ProjectStatus = 'active' | 'inactive' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
    priority: ProjectPriority;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function getProjects(
    companyId: string
): Promise<Project[]> {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    try {
        const projects = await db
            .select()   
            .from(projectsTable)
            .where(eq(projectsTable.companyId, companyId))
            .orderBy(desc(projectsTable.createdAt));

        const formattedProjects: Project[] = projects.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status as ProjectStatus,
            priority: project.priority as ProjectPriority,
            companyId: project.companyId,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }));

        return formattedProjects;
    } catch (error) {
        console.error('[getProjects] Failed to fetch projects:', error);
        return [];
    }
}

