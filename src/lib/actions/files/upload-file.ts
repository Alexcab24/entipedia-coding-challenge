'use server';

import { auth } from '@/auth.config';
import { UploadFileState, uploadFileInitialState } from './upload-file.types';
import { uploadFileSchema } from './schemas/upload-file.schema';
import { s3Client } from '@/lib/aws/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/lib/db';
import { filesTable } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { routes } from '@/router/routes';



export async function uploadFile(
    prevState: UploadFileState,
    formData: FormData
): Promise<UploadFileState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            ...uploadFileInitialState,
            status: 'error',
            message: 'No autorizado',
        };
    }

    console.log('[uploadFile] FormData:', formData);

    try {
        const name = formData.get('name');
        const type = formData.get('type');
        const companyId = formData.get('companyId');
        const file = formData.get('file');
        const url = formData.get('url');
        const description = formData.get('description');

        let fileInstance: File | undefined;
        if (file instanceof File) {
            if (file.size === 0 && file.name === '') {
                fileInstance = undefined;
            } else {
                fileInstance = file;
            }
        }

        //validar con zod
        const parsedResult = uploadFileSchema.safeParse({
            name,
            type,
            file: fileInstance,
            url: url || undefined,
            description: description || undefined,
            companyId: companyId as string,
        });

        if (!parsedResult.success) {
            const { fieldErrors } = parsedResult.error.flatten();
            return {
                ...uploadFileInitialState,
                status: 'error',
                message: 'Por favor, corrige los errores del formulario.',
                fieldErrors: {
                    name: fieldErrors.name?.[0],
                    type: fieldErrors.type?.[0],
                    file: fieldErrors.file?.[0],
                    url: fieldErrors.url?.[0],
                    description: fieldErrors.description?.[0],
                },
            };
        }

        const {
            name: validatedName,
            type: validatedType,
            file: validatedFile,
            url: validatedUrl,
            description: validatedDescription,
            companyId: validatedCompanyId
        } = parsedResult.data;



        let fileUrl = validatedUrl || '';

        if (validatedFile) {

            const arrayBuffer = await validatedFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileExtension = validatedFile.name.split('.').pop() || '';
            const fileKey = `${validatedName}-${Date.now()}.${fileExtension}`;



            try {
                await s3Client.send(new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME || '',
                    Key: fileKey,
                    Body: buffer,
                    ContentType: validatedFile.type,
                }));
            } catch (error) {
                console.error('[uploadFile] Error al subir el archivo a S3:', error);
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: 'Error al subir el archivo a S3. Por favor, intenta nuevamente.',
                    fieldErrors: {},
                };
            }

            fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;


            try {
                await db.insert(filesTable).values({
                    name: validatedName,
                    type: validatedType,
                    url: fileUrl,
                    key: fileKey,
                    description: validatedDescription || null,
                    companyId: validatedCompanyId,
                });

                revalidatePath(routes.files);

            } catch (error) {
                console.error('[uploadFile] Error al insertar el archivo en la base de datos:', error);
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: 'Error al insertar el archivo en la base de datos. Por favor, intenta nuevamente.',
                    fieldErrors: {},
                };
            }

        } else {
            console.log('[uploadFile] No hay archivo para subir, usando URL proporcionada');
        }


        return {
            status: 'success',
            message: 'Archivo procesado exitosamente',
        };
    } catch (error) {
        console.error('[uploadFile] Error:', error);

        return {
            ...uploadFileInitialState,
            status: 'error',
            message: 'Error al procesar el archivo. Por favor, intenta nuevamente.',
            fieldErrors: {},
        };
    }
}
