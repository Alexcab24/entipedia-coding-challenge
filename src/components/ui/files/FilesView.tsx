'use client';

import { useState, useEffect } from 'react';
import FilesTable from './FilesTable';
import FilesCardView from './FilesCardView';
import DeleteFileDialog from './DeleteFileDialog';
import ViewFileDialog from './ViewFileDialog';
import { File } from '@/lib/actions/files/get-files';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteFile } from '@/lib/actions/files/delete-file';

interface FilesViewProps {
    files: File[];
}

export default function FilesView({
    files,
}: FilesViewProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const [fileToView, setFileToView] = useState<File | null>(null);
    const [localFiles, setLocalFiles] = useState<File[]>(files);

    useEffect(() => {
        setLocalFiles(files);
    }, [files]);

    const handleDeleteClick = (file: File) => {
        setFileToDelete(file);
        setIsDeleteDialogOpen(true);
    };

    const handleViewClick = (file: File) => {
        //solo se abre si es una url
        if (file.key.startsWith('url-')) {
            window.open(file.url, '_blank');
            return;
        }

        setFileToView(file);
        setIsViewDialogOpen(true);
    };

    const handleDeleteConfirm = async (fileId: string, key: string) => {
        if (!fileId || !key) {
            throw new Error('ID de archivo o key inválido');
        }
        const result = await deleteFile(fileId, key);
        if (result.status === 'success') {
            router.refresh();
            toast.success('Archivo eliminado exitosamente');
        } else {
            throw new Error(result.message || 'Error al eliminar el archivo');
        }
    };

    return (
        <>
            {/* Desktop: Table View */}
            <div className="hidden lg:block">
                <FilesTable
                    files={localFiles}
                    onDelete={handleDeleteClick}
                    onView={handleViewClick}
                />
            </div>

            {/* Mobile: Card View */}
            <div className="lg:hidden">
                <FilesCardView
                    files={localFiles}
                    onDelete={handleDeleteClick}
                    onView={handleViewClick}
                />
            </div>

            {localFiles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No se encontraron archivos que coincidan con tu búsqueda.
                </div>
            )}

            <DeleteFileDialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) {
                        setFileToDelete(null);
                    }
                }}
                file={fileToDelete}
                onConfirm={handleDeleteConfirm}
            />

            <ViewFileDialog
                open={isViewDialogOpen}
                onOpenChange={(open) => {
                    setIsViewDialogOpen(open);
                    if (!open) {
                        setFileToView(null);
                    }
                }}
                file={fileToView}
            />
        </>
    );
}

