'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable, userCompaniesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { createWorkspaceSchema } from './schemas/create-workspace.schema';
import type { CreateWorkspaceState } from './create-workspace.types';

export async function createWorkspace(
    _prevState: CreateWorkspaceState,
    formData: FormData,
): Promise<CreateWorkspaceState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'Debes estar autenticado para crear una empresa.',
        };
    }

    const parsedResult = createWorkspaceSchema.safeParse({
        name: formData.get('name'),
        workspace: formData.get('workspace'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        description: formData.get('description'),
    });

    if (!parsedResult.success) {
        const { fieldErrors } = parsedResult.error.flatten();
        return {
            status: 'error',
            message: 'Por favor, corrige los errores del formulario.',
            fieldErrors: {
                name: fieldErrors.name?.[0],
                workspace: fieldErrors.workspace?.[0],
                email: fieldErrors.email?.[0],
                phone: fieldErrors.phone?.[0],
                description: fieldErrors.description?.[0],
            },
        };
    }

    const { name, workspace, email, phone, description } = parsedResult.data;


    const existingWorkspace = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.workspace, workspace))
        .limit(1);

    if (existingWorkspace.length > 0) {
        return {
            status: 'error',
            message: 'Ya existe un espacio de trabajo con ese nombre. Intenta con otro.',
            fieldErrors: {
                workspace: 'Este nombre de espacio de trabajo ya está en uso',
            },
        };
    }

    try {

        const [company] = await db
            .insert(companiesTable)
            .values({
                name,
                workspace,
                description: description || null,
            })
            .returning();

        await db.insert(userCompaniesTable).values({
            userId: session.user.id,
            companyId: company.id,
        });

        redirect(`/workspaces?created=${company.id}`);
    } catch (error) {
        console.error('Failed to create workspace:', error);

        if (error && typeof error === 'object' && 'digest' in error &&
            typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        if (error && typeof error === 'object' && 'code' in error &&
            (error as { code?: string }).code === '23505') {
            return {
                status: 'error',
                message: 'Ya existe un espacio de trabajo con ese nombre. Intenta con otro.',
                fieldErrors: {
                    workspace: 'Este nombre de espacio de trabajo ya está en uso',
                },
            };
        }

        return {
            status: 'error',
            message: 'Ocurrió un error al crear la empresa. Intenta nuevamente.',
        };
    }
}

