'use server';

import { db } from '@/lib/db';
import { projectsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import { routes } from '@/router/routes';
import { createProjectSchema } from './schemas/create-project.schema';
import { UpdateProjectFormData, updateProjectInitialState } from './update-project.types';

export interface UpdateProjectState {
    status: 'success' | 'error';
    message?: string;
}

//Update Project Status
export async function updateProjectStatus(
    projectId: string,
    status: 'active' | 'inactive' | 'completed' | 'cancelled'
): Promise<UpdateProjectState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'No autorizado',
        };
    }

    try {
        await db
            .update(projectsTable)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(projectsTable.id, projectId));

        revalidatePath(routes.projects);

        return {
            status: 'success',
            message: 'Proyecto actualizado exitosamente',
        };
    } catch (error) {
        console.error('[updateProjectStatus] Error:', error);
        return {
            status: 'error',
            message:
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar el proyecto',
        };
    }
}


//Update Project
export async function updateProject(
    projectId: string,
    formData: FormData
): Promise<UpdateProjectFormData> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'No autorizado',
        };
    }

    try {

        const parsedResult = createProjectSchema.safeParse({
            companyId: formData.get('companyId'),
            name: formData.get('name'),
            description: formData.get('description'),
            status: formData.get('status'),
            priority: formData.get('priority'),
        });

        if (!parsedResult.success) {

            const { fieldErrors } = parsedResult.error.flatten();
            return {
                ...updateProjectInitialState,
                status: 'error',
                message: 'Por favor, corrige los errores del formulario.',
                fieldErrors: {
                    name: fieldErrors.name?.[0],
                    description: fieldErrors.description?.[0],
                    status: fieldErrors.status?.[0],
                    priority: fieldErrors.priority?.[0],
                },
            };
        }

        const { companyId, name, description, status, priority } = parsedResult.data;


        await db.update(projectsTable).set({
            companyId,
            name,
            description,
            status,
            priority,
            updatedAt: new Date(),
        }).where(eq(projectsTable.id, projectId));

        revalidatePath(routes.projects);

        return {
            status: 'success',
            message: 'Proyecto actualizado exitosamente',
            
        };
    } catch (error) {
        console.error('[updateProject] Error:', error);
        return {
            status: 'error',
            message:
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar el proyecto',
        };
    }
}