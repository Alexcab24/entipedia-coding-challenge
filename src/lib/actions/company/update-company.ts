'use server';

import { auth } from "@/auth.config";
import { db } from "@/lib/db";
import { companiesTable } from "@/lib/db/schema";
import { routes } from "@/router/routes";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { updateCompanySchema } from "./schema/update-company.schema";
import { UpdateCompanyState } from "./update-company.types";

export async function updateCompany(
    _prevState: UpdateCompanyState,
    formData: FormData
): Promise<UpdateCompanyState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'No autorizado',
        };
    }

    try {
        const descriptionValue = formData.get('description');
        const parsedResult = updateCompanySchema.safeParse({
            companyId: formData.get('companyId'),
            name: formData.get('name'),
            description: descriptionValue === null || descriptionValue === '' ? undefined : descriptionValue,
        });
        if (!parsedResult.success) {
            return {
                status: 'error',
                message: 'Campo inválido',
            };
        }

        const { name, description, companyId } = parsedResult.data;

        await db.update(companiesTable).set({
            name,
            description: description || null,
            updatedAt: new Date(),
        }).where(eq(companiesTable.id, companyId));

        revalidatePath(routes.settings);

        return {
            status: 'success',
            message: 'Empresa actualizada exitosamente',
        };
    } catch (error) {
        console.error('[updateCompany] Error:', error);
        return {
            status: 'error',
            message: 'Error al actualizar la empresa',
        };
    }
}