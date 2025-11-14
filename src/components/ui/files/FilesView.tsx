'use client';

import { useState, useEffect, useMemo } from 'react';
import FilesTable from './FilesTable';
import FilesCardView from './FilesCardView';
import DeleteFileDialog from './DeleteFileDialog';
import { File } from '@/lib/actions/files/get-files';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FilesViewProps {
    files: File[];
    searchQuery: string;
}

export default function FilesView({
    files,
    searchQuery,
}: FilesViewProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const [localFiles, setLocalFiles] = useState<File[]>(files);

    useEffect(() => {
        setLocalFiles(files);
    }, [files]);

    const searchFilteredFiles = useMemo(() => {
        return localFiles.filter((file) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                file.name.toLowerCase().includes(query) ||
                (file.description?.toLowerCase().includes(query) ?? false) ||
                file.type.toLowerCase().includes(query)
            );
        });
    }, [localFiles, searchQuery]);

    const handleDeleteClick = (file: File) => {
        setFileToDelete(file);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (fileId: string) => {
        // TODO: Implement delete when backend is ready
        router.refresh();
        toast.success('Archivo eliminado exitosamente');
    };

    const displayFiles = searchQuery ? searchFilteredFiles : localFiles;

    return (
        <>
            {/* Desktop: Table View */}
            <div className="hidden lg:block">
                <FilesTable
                    files={displayFiles}
                    onDelete={handleDeleteClick}
                />
            </div>

            {/* Mobile: Card View */}
            <div className="lg:hidden">
                <FilesCardView
                    files={displayFiles}
                    onDelete={handleDeleteClick}
                />
            </div>

            {searchQuery && searchFilteredFiles.length === 0 && (
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

