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

    try {
        const name = formData.get('name');
        const type = formData.get('type');
        const companyId = formData.get('companyId');
        const file = formData.get('file');
        const url = formData.get('url');
        const description = formData.get('description');


        if (!name || !type || !companyId) {
            return {
                ...uploadFileInitialState,
                status: 'error',
                message: 'Faltan campos requeridos: nombre, tipo o empresa',
                fieldErrors: {},
            };
        }

        if (!file && !url) {
            return {
                ...uploadFileInitialState,
                status: 'error',
                message: 'Debes proporcionar un archivo o una URL',
                fieldErrors: {},
            };
        }

        console.log('[uploadFile] Iniciando procesamiento:', {
            name,
            type,
            companyId,
            hasFile: !!file,
            fileSize: file instanceof File ? file.size : 0,
            fileName: file instanceof File ? file.name : null,
            fileType: file instanceof File ? file.type : null,
            hasUrl: !!url,
        });

        let fileInstance: File | undefined;
        if (file instanceof File) {
            if (file.size === 0) {
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: 'El archivo está vacío',
                    fieldErrors: { file: 'El archivo está vacío' },
                };
            }


            const MAX_SIZE = 100 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: `El archivo es demasiado grande. El tamaño máximo es ${MAX_SIZE / 1024 / 1024}MB`,
                    fieldErrors: { file: 'El archivo excede el tamaño máximo permitido' },
                };
            }

                fileInstance = file;
                console.log('[uploadFile] Archivo detectado:', {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });
        } else if (file) {

            return {
                ...uploadFileInitialState,
                status: 'error',
                message: 'El archivo proporcionado no es válido',
                fieldErrors: { file: 'El archivo no es válido' },
            };
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
            console.error('[uploadFile] Error de validación:', parsedResult.error.flatten());
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
            console.log('[uploadFile] Procesando archivo:', {
                name: validatedFile.name,
                size: validatedFile.size,
                type: validatedFile.type,
                fileType: validatedType,
            });

            const fileExtension = validatedFile.name.split('.').pop() || '';
            const fileKey = `${validatedName}-${Date.now()}.${fileExtension}`;

            try {
                const arrayBuffer = await validatedFile.arrayBuffer();
                console.log('[uploadFile] ArrayBuffer obtenido, tamaño:', arrayBuffer.byteLength);

                const buffer = Buffer.from(arrayBuffer);

                console.log('[uploadFile] Subiendo a S3:', {
                    bucket: process.env.S3_BUCKET_NAME,
                    key: fileKey,
                    size: buffer.length,
                });

                await s3Client.send(new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME || '',
                    Key: fileKey,
                    Body: buffer,
                    ContentType: validatedFile.type,
                }));

                console.log('[uploadFile] Archivo subido exitosamente a S3');

            } catch (error) {
                console.error('[uploadFile] Error al subir el archivo a S3:', error);
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: `Error al subir el archivo a S3: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, intenta nuevamente.`,
                    fieldErrors: {},
                };
            }

            fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileKey}`;

            try {
                console.log('[uploadFile] Insertando en base de datos:', {
                    name: validatedName,
                    type: validatedType,
                    url: fileUrl,
                    key: fileKey,
                });

                await db.insert(filesTable).values({
                    name: validatedName,
                    type: validatedType,
                    url: fileUrl,
                    key: fileKey,
                    description: validatedDescription || null,
                    companyId: validatedCompanyId,
                });

                console.log('[uploadFile] Archivo insertado exitosamente en la base de datos');
                revalidatePath(routes.files);

            } catch (error) {
                console.error('[uploadFile] Error al insertar el archivo en la base de datos:', error);
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: `Error al insertar el archivo en la base de datos: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, intenta nuevamente.`,
                    fieldErrors: {},
                };
            }

        } else {
            //subida de archivo por url
            if (!validatedUrl) {
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: 'Debes proporcionar un archivo o una URL.',
                    fieldErrors: {},
                };
            }

            const urlKey = `url-${Date.now()}-${validatedName.replace(/\s+/g, '-').toLowerCase()}`;

            try {
                await db.insert(filesTable).values({
                    name: validatedName,
                    type: validatedType,
                    url: validatedUrl,
                    key: urlKey,
                    description: validatedDescription || null,
                    companyId: validatedCompanyId,
                });

                revalidatePath(routes.files);

            } catch (error) {
                console.error('[uploadFile] Error al insertar el archivo con URL en la base de datos:', error);
                return {
                    ...uploadFileInitialState,
                    status: 'error',
                    message: 'Error al insertar el archivo en la base de datos. Por favor, intenta nuevamente.',
                    fieldErrors: {},
                };
            }
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
