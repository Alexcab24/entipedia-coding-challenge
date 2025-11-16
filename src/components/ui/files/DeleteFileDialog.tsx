'use client';

import { useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../dialog';
import Button from '../Button';
import { AlertTriangle, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { File } from '@/lib/actions/files/get-files';

interface DeleteFileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: File | null;
    onConfirm: (fileId: string, key: string) => Promise<void>;
}

export default function DeleteFileDialog({
    open,
    onOpenChange,
    file,
    onConfirm,
}: DeleteFileDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        if (!file) return;

        startTransition(async () => {
            try {
                await onConfirm(file.id, file.key);
                toast.success('Archivo eliminado exitosamente');
                onOpenChange(false);
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : 'Error al eliminar el archivo';
                toast.error(errorMessage);
            }
        });
    };

    const handleCancel = () => {
        if (!isPending) {
            onOpenChange(false);
        }
    };

    if (!file) return null;

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle>Eliminar Archivo</DialogTitle>
                            <DialogDescription className="mt-1">
                                Esta acción no se puede deshacer
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <p className="text-sm text-foreground">
                            ¿Estás seguro de que deseas eliminar el siguiente archivo?
                        </p>
                        <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                            <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Nombre:
                                </span>
                                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    {file.name}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Tipo:
                                </span>
                                <p className="text-sm text-foreground">
                                    {file.type}
                                </p>
                            </div>
                            {file.description && (
                                <div>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Descripción:
                                    </span>
                                    <p className="text-sm text-foreground line-clamp-2">
                                        {file.description}
                                    </p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Se eliminará el archivo permanentemente del sistema.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar Archivo'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

