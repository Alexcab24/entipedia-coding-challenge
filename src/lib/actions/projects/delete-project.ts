'use server';

import { db } from '@/lib/db';
import { projectsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import { routes } from '@/router/routes';

export interface DeleteProjectState {
    status: 'success' | 'error';
    message?: string;
}

export async function deleteProject(
    projectId: string
): Promise<DeleteProjectState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'No autorizado',
        };
    }

    try {
        if (!projectId || typeof projectId !== 'string') {
            return {
                status: 'error',
                message: 'ID de proyecto inválido',
            };
        }

        await db.delete(projectsTable).where(eq(projectsTable.id, projectId));

        revalidatePath(routes.projects);

        return {
            status: 'success',
            message: 'Proyecto eliminado exitosamente',
        };
    } catch (error) {
        console.error('[deleteProject] Error:', error);
        return {
            status: 'error',
            message:
                error instanceof Error
                    ? error.message
                    : 'Error al eliminar el proyecto',
        };
    }
}

