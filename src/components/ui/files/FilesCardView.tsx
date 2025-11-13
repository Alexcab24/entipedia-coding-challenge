'use client';

import { File } from './FilesPageClient';
import FileCard from './FileCard';

interface FilesCardViewProps {
    files: File[];
    onDelete: (file: File) => void;
}

export default function FilesCardView({
    files,
    onDelete,
}: FilesCardViewProps) {
    if (files.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-base font-medium">No hay archivos registrados</p>
                    <p className="text-sm text-muted-foreground/70">Comienza agregando tu primer archivo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:gap-6">
            {files.map((file) => (
                <FileCard
                    key={file.id}
                    file={file}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

