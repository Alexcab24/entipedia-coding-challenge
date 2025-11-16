'use server';

import { db } from '@/lib/db';
import { clientsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth.config';
import { CreateClientState, createClientInitialState } from './create-client.types';
import { createClientSchema } from './schemas/create-client.schema';

type PostgresError = {
    code?: string;
    message?: string;
    constraint?: string;
    cause?: unknown;
};

const isUniqueConstraintError = (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) {
        return false;
    }


    if ('code' in error && (error as PostgresError).code === '23505') {
        return true;
    }


    if ('cause' in error) {
        const cause = (error as PostgresError).cause;
        if (
            typeof cause === 'object' &&
            cause !== null &&
            'code' in cause &&
            (cause as PostgresError).code === '23505'
        ) {
            return true;
        }
    }

    return false;
};

const getConstraintField = (error: unknown): string | null => {
    if (typeof error !== 'object' || error === null) {
        return null;
    }


    if ('constraint' in error) {
        const constraint = String((error as PostgresError).constraint || '');
        if (constraint.includes('email') || constraint.includes('clients_email_unique')) {
            return 'email';
        }
        if (constraint.includes('phone')) {
            return 'phone';
        }
    }


    if ('cause' in error) {
        const cause = (error as PostgresError).cause;
        if (typeof cause === 'object' && cause !== null && 'constraint' in cause) {
            const constraint = String((cause as PostgresError).constraint || '');
            if (constraint.includes('email') || constraint.includes('clients_email_unique')) {
                return 'email';
            }
            if (constraint.includes('phone')) {
                return 'phone';
            }
        }
    }

    return null;
};

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as { message?: string }).message || '');
    }
    if (typeof error === 'object' && error !== null && 'cause' in error) {
        const cause = (error as PostgresError).cause;
        if (cause instanceof Error) {
            return cause.message;
        }
        if (typeof cause === 'object' && cause !== null && 'message' in cause) {
            return String((cause as { message?: string }).message || '');
        }
    }
    return '';
};

export async function createClient(
    prevState: CreateClientState,
    formData: FormData
): Promise<CreateClientState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            ...createClientInitialState,
            status: 'error',
            message: 'No autorizado',
        };
    }

    try {
        const parsedResult = createClientSchema.safeParse({
            companyId: formData.get('companyId'),
            name: formData.get('name'),
            type: formData.get('type'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            value: formData.get('value'),
            dateFrom: formData.get('dateFrom'),
            dateTo: formData.get('dateTo'),
            notes: formData.get('notes'),
        });

        if (!parsedResult.success) {
            const { fieldErrors } = parsedResult.error.flatten();
            return {
                ...createClientInitialState,
                status: 'error',
                message: 'Por favor, corrige los errores del formulario.',
                fieldErrors: {
                    name: fieldErrors.name?.[0],
                    type: fieldErrors.type?.[0],
                    email: fieldErrors.email?.[0],
                    phone: fieldErrors.phone?.[0],
                    value: fieldErrors.value?.[0],
                    dateFrom: fieldErrors.dateFrom?.[0],
                    dateTo: fieldErrors.dateTo?.[0],
                    notes: fieldErrors.notes?.[0],
                },
            };
        }

        const { companyId, name, type, email, phone, value, dateFrom, dateTo, notes } = parsedResult.data;


        const existingClient = await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.email, email))
            .limit(1);

        if (existingClient.length > 0) {
            return {
                ...createClientInitialState,
                status: 'error',
                message: 'Ya existe un cliente con este email.',
                fieldErrors: {
                    email: 'Este email ya está registrado',
                },
            };
        }

        await db.insert(clientsTable).values({
            companyId,
            name,
            type,
            email,
            phone,
            value,
            dateFrom,
            dateTo,
            notes,
        });

        return {
            status: 'success',
            message: 'Cliente creado exitosamente',
        };
    } catch (error) {
        console.error('[createClient] Error:', error);


        if (isUniqueConstraintError(error)) {
            const field = getConstraintField(error);
            const errorMessage = getErrorMessage(error).toLowerCase();


            if (field === 'email' || errorMessage.includes('email') || errorMessage.includes('clients_email_unique')) {
                return {
                    ...createClientInitialState,
                    status: 'error',
                    message: 'Ya existe un cliente con este email.',
                    fieldErrors: {
                        email: 'Este email ya está registrado',
                    },
                };
            }

            if (field === 'phone' || errorMessage.includes('phone')) {
                return {
                    ...createClientInitialState,
                    status: 'error',
                    message: 'Ya existe un cliente con este teléfono.',
                    fieldErrors: {
                        phone: 'Este teléfono ya está registrado',
                    },
                };
            }

            return {
                ...createClientInitialState,
                status: 'error',
                message: 'El cliente ya existe en el sistema.',
                fieldErrors: {},
            };
        }


        if (error instanceof Error) {
            const errorMsg = error.message.toLowerCase();


            if (errorMsg.includes('unique') || errorMsg.includes('duplicate') || errorMsg.includes('23505')) {
                if (errorMsg.includes('email') || errorMsg.includes('clients_email_unique')) {
                    return {
                        ...createClientInitialState,
                        status: 'error',
                        message: 'Ya existe un cliente con este email.',
                        fieldErrors: {
                            email: 'Este email ya está registrado',
                        },
                    };
                }

                if (errorMsg.includes('phone')) {
                    return {
                        ...createClientInitialState,
                        status: 'error',
                        message: 'Ya existe un cliente con este teléfono.',
                        fieldErrors: {
                            phone: 'Este teléfono ya está registrado',
                        },
                    };
                }
            }

            return {
                ...createClientInitialState,
                status: 'error',
                message: 'Error al crear el cliente. Por favor, verifica los datos e intenta nuevamente.',
                fieldErrors: {},
            };
        }

        // Error desconocido
        return {
            ...createClientInitialState,
            status: 'error',
            message: 'Error al crear el cliente. Por favor, intenta nuevamente.',
            fieldErrors: {},
        };
    }
}

