'use server';

import { db } from '@/lib/db';
import { clientsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import { routes } from '@/router/routes';
import { validateClientFieldUpdate, updateClientFieldSchema } from './schemas/update-client.schema';

export interface UpdateClientState {
    status: 'success' | 'error';
    message?: string;
}

export async function updateClient(
    clientId: string,
    field: string,
    value: string | null
): Promise<UpdateClientState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'No autorizado',
        };
    }

    try {

        const fieldValidation = updateClientFieldSchema.shape.field.safeParse(field);
        if (!fieldValidation.success) {
            return {
                status: 'error',
                message: 'Campo inválido',
            };
        }


        const validationResult = validateClientFieldUpdate(field, value);

        if (!validationResult.success) {
            return {
                status: 'error',
                message: validationResult.error || 'Error de validación',
            };
        }


        const fieldValue = validationResult.data ?? null;
        const updateData = {
            [field]: fieldValue,
            updatedAt: new Date(),
        };

        await db
            .update(clientsTable)
            .set(updateData)
            .where(eq(clientsTable.id, clientId));

        revalidatePath(routes.clients);

        return {
            status: 'success',
            message: 'Cliente actualizado exitosamente',
        };
    } catch (error) {
        console.error('[updateClient] Error:', error);
        return {
            status: 'error',
            message:
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar el cliente',
        };
    }
}

