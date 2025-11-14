'use client';

import { useState, useEffect } from 'react';
import FilesTable from './FilesTable';
import FilesCardView from './FilesCardView';
import DeleteFileDialog from './DeleteFileDialog';
import { File } from '@/lib/actions/files/get-files';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FilesViewProps {
    files: File[];
}

export default function FilesView({
    files,
}: FilesViewProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const [localFiles, setLocalFiles] = useState<File[]>(files);

    useEffect(() => {
        setLocalFiles(files);
    }, [files]);

    const handleDeleteClick = (file: File) => {
        setFileToDelete(file);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (fileId: string) => {
        // TODO: Implement delete when backend is ready
        router.refresh();
        toast.success('Archivo eliminado exitosamente');
    };

    return (
        <>
            {/* Desktop: Table View */}
            <div className="hidden lg:block">
                <FilesTable
                    files={localFiles}
                    onDelete={handleDeleteClick}
                />
            </div>

            {/* Mobile: Card View */}
            <div className="lg:hidden">
                <FilesCardView
                    files={localFiles}
                    onDelete={handleDeleteClick}
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
        </>
    );
}

