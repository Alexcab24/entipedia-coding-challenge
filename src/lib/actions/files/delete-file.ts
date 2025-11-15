"use server";

import { auth } from "@/auth.config";
import { s3Client } from "@/lib/aws/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { filesTable } from "@/lib/db/schema";
import { routes } from "@/router/routes";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface DeleteFileState {
    status: 'success' | 'error';
    message?: string;
}


export async function deleteFile(fileId: string, key: string): Promise<DeleteFileState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: 'error',
            message: 'No autorizado',
        };
    }

    if (!fileId || typeof fileId !== 'string') {
        return {
            status: 'error',
            message: 'ID de archivo inválido',
        };
    }

    try {
        // Delete file from S3
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: key,
        }));

        // Delete file from database
        await db.delete(filesTable).where(eq(filesTable.id, fileId));

        revalidatePath(routes.files);
    } catch (error) {
        console.error('[deleteFile] Error:', error);
        return {
            status: 'error',
            message: 'Error al eliminar el archivo',
        };
    }

    return {
        status: 'success',
        message: 'Archivo eliminado exitosamente',
    };
}