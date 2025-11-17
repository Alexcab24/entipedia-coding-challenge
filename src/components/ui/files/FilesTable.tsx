'use client';

import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../table';
import { File } from '@/lib/actions/files/get-files';
import Button from '../Button';
import { Trash2, Download, ExternalLink, FileText, Image, Video, Music, FileIcon, MoreVertical, Link2 } from 'lucide-react';
import { formatDateDisplay } from '@/lib/utils/date';

interface FilesTableProps {
    files: File[];
    onDelete: (file: File) => void;
    onView: (file: File) => void;
}

const isUrlFile = (file: File) => {
    return file.key.startsWith('url-');
};

const getFileTypeIcon = (file: File) => {
    if (isUrlFile(file)) {
        return <Link2 className="h-5 w-5 text-cyan-500" />;
    }

    switch (file.type) {
        case 'pdf':
            return <FileText className="h-5 w-5 text-red-500" />;
        case 'image':
            // eslint-disable-next-line jsx-a11y/alt-text
            return <Image className="h-5 w-5 text-blue-500" />;
        case 'video':
            return <Video className="h-5 w-5 text-purple-500" />;
        case 'audio':
            return <Music className="h-5 w-5 text-green-500" />;
        case 'document':
            return <FileIcon className="h-5 w-5 text-orange-500" />;
        default:
            return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
};

const getFileTypeLabel = (file: File) => {
    if (isUrlFile(file)) {
        return 'URL';
    }

    const labels: Record<File['type'], string> = {
        pdf: 'PDF',
        image: 'Imagen',
        video: 'Video',
        audio: 'Audio',
        document: 'Documento',
        other: 'Otro',
    };
    return labels[file.type];
};

const getFileTypeBadgeColor = (file: File) => {
    if (isUrlFile(file)) {
        return 'bg-cyan-100/80 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200/50 dark:border-cyan-800/50';
    }

    switch (file.type) {
        case 'pdf':
            return 'bg-red-100/80 text-red-800 dark:bg-red-950/40 dark:text-red-300 border-red-200/50 dark:border-red-800/50';
        case 'image':
            return 'bg-blue-100/80 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50';
        case 'video':
            return 'bg-purple-100/80 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50';
        case 'audio':
            return 'bg-green-100/80 text-green-800 dark:bg-green-950/40 dark:text-green-300 border-green-200/50 dark:border-green-800/50';
        case 'document':
            return 'bg-orange-100/80 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50';
        default:
            return 'bg-gray-100/80 text-gray-800 dark:bg-gray-950/40 dark:text-gray-300 border-gray-200/50 dark:border-gray-800/50';
    }
};

export default function FilesTable({
    files,
    onDelete,
    onView,
}: FilesTableProps) {
    const handleDownload = (file: File) => {
        window.open(file.url, '_blank');
    };

    return (
        <div className="hidden lg:flex flex-col rounded-xl border border-border/60 bg-card shadow-md overflow-hidden max-h-[600px]">
            {/* Header de la tabla */}
            <div className="shrink-0 overflow-hidden">
                <table className="w-full border-collapse caption-bottom text-sm" style={{ tableLayout: 'fixed' }}>
                    <colgroup>
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <TableHeader className="bg-linear-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md z-10 border-b-2 border-primary/30">
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center">
                                    <FileText className="h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Nombre</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Tipo</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Descripción</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Fecha</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <MoreVertical className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Acciones</span>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                </table>
            </div>
            {/* Body de la tabla */}
            <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto custom-scrollbar">
                <table className="w-full border-collapse caption-bottom text-sm" style={{ tableLayout: 'fixed' }}>
                    <colgroup>
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <TableBody className="bg-background/50 divide-y divide-border/20">
                        {files.length === 0 ? (
                            <TableRow className="border-0 hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="h-12 w-12 text-muted-foreground/30 mb-2" />
                                        <span className="text-base font-medium">No hay archivos registrados</span>
                                        <span className="text-sm text-muted-foreground/70">Comienza agregando tu primer archivo</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            files.map((file) => (
                                <TableRow
                                    key={file.id}
                                    className="border-0 border-b-2 border-l-4 border-l-transparent hover:border-l-primary hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group"
                                >
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center justify-center">
                                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                {getFileTypeIcon(file)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-foreground font-semibold truncate group-hover:text-primary transition-colors">
                                                    {file.name}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-sm">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border ${getFileTypeBadgeColor(file)}`}>
                                            {getFileTypeIcon(file)}
                                            {getFileTypeLabel(file)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-sm min-w-[200px]">
                                        {file.description ? (
                                            <p className="text-foreground line-clamp-2">
                                                {file.description}
                                            </p>
                                        ) : (
                                            <span className="text-muted-foreground/50 italic">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-sm">
                                        <span className="text-muted-foreground">
                                            {formatDateDisplay(file.createdAt, {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onView(file)}
                                                className="hover:bg-primary/10 hover:text-primary transition-all duration-200 opacity-50 group-hover:opacity-100 hover:scale-110 rounded-lg"
                                                title="Ver archivo"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownload(file)}
                                                className="hover:bg-primary/10 hover:text-primary transition-all duration-200 opacity-50 group-hover:opacity-100 hover:scale-110 rounded-lg"
                                                title="Descargar archivo"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(file)}
                                                className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 opacity-50 group-hover:opacity-100 hover:scale-110 rounded-lg"
                                                title="Eliminar archivo"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </table>
            </div>
        </div>
    );
}

