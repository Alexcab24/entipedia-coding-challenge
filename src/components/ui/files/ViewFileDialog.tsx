'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../dialog';
import { File } from '@/lib/actions/files/get-files';
import { Download, ExternalLink, FileText, Image as ImageIcon, Video, Music, FileIcon, Link2 } from 'lucide-react';
import Button from '../Button';
import Image from 'next/image';

interface ViewFileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: File | null;
}

const isUrlFile = (file: File | null) => {
    if (!file) return false;
    return file.key.startsWith('url-');
};

const getFileTypeIcon = (file: File | null) => {
    if (!file) return <FileIcon className="h-5 w-5 text-gray-500" />;

    if (isUrlFile(file)) {
        return <Link2 className="h-5 w-5 text-cyan-500" />;
    }

    switch (file.type) {
        case 'pdf':
            return <FileText className="h-5 w-5 text-red-500" />;
        case 'image':
            return <ImageIcon className="h-5 w-5 text-blue-500" />;
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

export default function ViewFileDialog({
    open,
    onOpenChange,
    file,
}: ViewFileDialogProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (file && open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
        }
    }, [file, open]);

    if (!file) return null;

    const handleDownload = () => {
        window.open(file.url, '_blank');
    };

    const handleOpenExternal = () => {
        window.open(file.url, '_blank');
    };

    const renderFileContent = () => {
        if (isUrlFile(file)) {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] space-y-4 p-4 sm:p-6 md:p-8">
                    <div className="p-4 sm:p-6 rounded-full bg-cyan-100/20 dark:bg-cyan-950/40 shrink-0">
                        <Link2 className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-500" />
                    </div>
                    <div className="text-center space-y-2 px-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">
                            Archivo URL
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                            Este archivo es una URL externa. Para verlo, haz clic en el botón de abajo para abrirlo en una nueva pestaña.
                        </p>
                        <div className="pt-4">
                            <Button
                                variant="primary"
                                onClick={handleOpenExternal}
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Abrir URL Externa
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        switch (file.type) {
            case 'pdf':
                return (
                    <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex flex-col">
                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 rounded-lg">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-sm text-muted-foreground">Cargando PDF...</p>
                                </div>
                            </div>
                        )}
                        <iframe
                            src={file.url}
                            className="w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] border-0 rounded-lg"
                            title={file.name}
                            onLoad={() => setLoading(false)}
                        />
                    </div>
                );

            case 'image':
                return (
                    <div className="relative w-full flex items-center justify-center">
                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 rounded-lg">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-sm text-muted-foreground">Cargando imagen...</p>
                                </div>
                            </div>
                        )}
                        <div className="relative w-full max-w-full h-auto max-h-[60vh] sm:max-h-[70vh] flex items-center justify-center">
                            <Image
                                width={1200}
                                height={1200}
                                src={file.url}
                                alt={file.name}
                                className="w-auto h-auto max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg"
                                onLoad={() => setLoading(false)}
                                onError={() => setLoading(false)}
                                unoptimized
                            />
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="relative w-full flex items-center justify-center">
                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 rounded-lg">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-sm text-muted-foreground">Cargando video...</p>
                                </div>
                            </div>
                        )}
                        <div className="relative w-full max-w-full aspect-video bg-black/5 dark:bg-black/20 rounded-lg overflow-hidden">
                            <video
                                src={file.url}
                                controls
                                className="w-full h-full object-contain rounded-lg"
                                onLoadedData={() => setLoading(false)}
                                onError={() => setLoading(false)}
                                playsInline
                            />
                        </div>
                    </div>
                );

            case 'audio':
                return (
                    <div className="relative w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 space-y-4 min-h-[250px] sm:min-h-[300px]">
                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 rounded-lg">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-sm text-muted-foreground">Cargando audio...</p>
                                </div>
                            </div>
                        )}
                        <div className="p-4 sm:p-6 rounded-full bg-green-100/20 dark:bg-green-950/40 shrink-0">
                            <Music className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
                        </div>
                        <div className="text-center space-y-2 w-full max-w-md px-2">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                                {file.name}
                            </h3>
                            <audio
                                src={file.url}
                                controls
                                className="w-full"
                                onLoadedData={() => setLoading(false)}
                                onError={() => setLoading(false)}
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] space-y-4 p-4 sm:p-6 md:p-8">
                        <div className="p-4 sm:p-6 rounded-full bg-gray-100/20 dark:bg-gray-950/40 shrink-0">
                            <FileIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500" />
                        </div>
                        <div className="text-center space-y-2 px-2">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground">
                                Vista previa no disponible
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                                Este tipo de archivo no se puede mostrar en el visor. Puedes descargarlo para verlo.
                            </p>
                            <div className="pt-4">
                                <Button
                                    variant="primary"
                                    onClick={handleDownload}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Descargar Archivo
                                </Button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-[95vw] sm:w-[90vw] max-h-[95vh] sm:max-h-[90vh] p-0 gap-0 flex flex-col">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                {getFileTypeIcon(file)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-left truncate text-base sm:text-lg">{file.name}</DialogTitle>
                                {file.description && (
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {file.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {!isUrlFile(file) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="hover:bg-primary/10 hover:text-primary text-xs sm:text-sm"
                                >
                                    <Download className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Descargar</span>
                                </Button>
                            )}
                            {isUrlFile(file) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleOpenExternal}
                                    className="hover:bg-primary/10 hover:text-primary text-xs sm:text-sm"
                                >
                                    <ExternalLink className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Abrir</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogHeader>
                <div className="relative overflow-auto flex-1 p-3 sm:p-4 md:p-6 min-h-[300px] sm:min-h-[400px]">
                    {renderFileContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}

