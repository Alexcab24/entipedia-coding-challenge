'use server';

import { db } from '@/lib/db';
import { projectsTable } from '@/lib/db/schema';
import { auth } from '@/auth.config';
import { CreateProjectState, createProjectInitialState } from './create-project.types';
import { createProjectSchema } from './schemas/create-project.schema';

export async function createProject(
    prevState: CreateProjectState,
    formData: FormData
): Promise<CreateProjectState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            ...createProjectInitialState,
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
                ...createProjectInitialState,
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

        await db.insert(projectsTable).values({
            companyId,
            name,
            description,
            status,
            priority,
        });

        return {
            status: 'success',
            message: 'Proyecto creado exitosamente',
        };
    } catch (error) {
        console.error('[createProject] Error:', error);

        if (error instanceof Error) {
            return {
                ...createProjectInitialState,
                status: 'error',
                message: 'Error al crear el proyecto. Por favor, verifica los datos e intenta nuevamente.',
                fieldErrors: {},
            };
        }

        return {
            ...createProjectInitialState,
            status: 'error',
            message: 'Error al crear el proyecto. Por favor, intenta nuevamente.',
            fieldErrors: {},
        };
    }
}

