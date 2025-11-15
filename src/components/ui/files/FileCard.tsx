'use client';

import { File } from '@/lib/actions/files/get-files';
import { Card, CardContent } from '../card';
import Button from '../Button';
import { Trash2, Download, ExternalLink, FileText, Image, Video, Music, FileIcon, Calendar, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FileCardProps {
    file: File;
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

export default function FileCard({
    file,
    onDelete,
    onView,
}: FileCardProps) {
    const handleDownload = () => {
        window.open(file.url, '_blank');
    };

    return (
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary overflow-hidden group bg-gradient-to-br from-card via-card/95 to-card/90 active:scale-[0.99]">
            <CardContent className="p-6 md:p-7 space-y-6">
                {/* Header con nombre y acciones */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b-2 border-primary/20">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 shrink-0 shadow-sm">
                            {getFileTypeIcon(file)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-foreground truncate mb-2">
                                {file.name}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border ${getFileTypeBadgeColor(file)}`}>
                                {getFileTypeIcon(file)}
                                {getFileTypeLabel(file)}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => onDelete(file)}
                        className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 opacity-50 group-hover:opacity-100 rounded-xl hover:scale-110 active:scale-95 min-w-[48px] min-h-[48px]"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>

                {/* Descripción */}
                {file.description && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                            <div className="p-1.5 rounded-lg bg-muted/50">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span>Descripción</span>
                        </div>
                        <p className="text-base text-foreground line-clamp-3">
                            {file.description}
                        </p>
                    </div>
                )}

                {/* Fecha */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-muted/50">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <span>Fecha de creación</span>
                    </div>
                    <p className="text-base text-foreground font-medium">
                        {format(new Date(file.createdAt), 'PPP', { locale: es })}
                    </p>
                </div>

                {/* Acciones */}
                <div className="flex gap-3 pt-4 border-t-2 border-primary/20">
                    <Button
                        variant="outline"
                        onClick={() => onView(file)}
                        className="flex-1 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleDownload}
                        className="flex-1 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

