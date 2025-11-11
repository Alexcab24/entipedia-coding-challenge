'use server';

import { db } from '@/lib/db';
import { clientsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import { deleteClientSchema } from './schemas/delete-client.schema';

export interface DeleteClientState {
    status: 'success' | 'error';
    message?: string;
}

export async function deleteClient(
    clientId: string
): Promise<DeleteClientState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'No autorizado',
        };
    }

    try {

        const parsedResult = deleteClientSchema.safeParse({ clientId });

        if (!parsedResult.success) {
            return {
                status: 'error',
                message: 'ID de cliente inválido',
            };
        }

        await db.delete(clientsTable).where(eq(clientsTable.id, parsedResult.data.clientId));

        revalidatePath('/clients');

        return {
            status: 'success',
            message: 'Cliente eliminado exitosamente',
        };
    } catch (error) {
        console.error('[deleteClient] Error:', error);
        return {
            status: 'error',
            message:
                error instanceof Error
                    ? error.message
                    : 'Error al eliminar el cliente',
        };
    }
}

