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
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Project } from '@/lib/actions/projects/get-projects';
import { toast } from 'sonner';

interface DeleteProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onConfirm: (projectId: string) => Promise<void>;
}

export default function DeleteProjectDialog({
    open,
    onOpenChange,
    project,
    onConfirm,
}: DeleteProjectDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        if (!project) return;

        startTransition(async () => {
            try {
                await onConfirm(project.id);
                toast.success('Proyecto eliminado exitosamente');
                onOpenChange(false);
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : 'Error al eliminar el proyecto';
                toast.error(errorMessage);
            }
        });
    };

    const handleCancel = () => {
        if (!isPending) {
            onOpenChange(false);
        }
    };

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle>Eliminar Proyecto</DialogTitle>
                            <DialogDescription className="mt-1">
                                Esta acción no se puede deshacer
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <p className="text-sm text-foreground">
                            ¿Estás seguro de que deseas eliminar el siguiente proyecto?
                        </p>
                        <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                            <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Nombre:
                                </span>
                                <p className="text-sm font-medium text-foreground">
                                    {project.name}
                                </p>
                            </div>
                            {project.description && (
                                <div>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Descripción:
                                    </span>
                                    <p className="text-sm text-foreground">
                                        {project.description}
                                    </p>
                                </div>
                            )}
                            <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Estatus:
                                </span>
                                <p className="text-sm text-foreground">
                                    {project.status === 'active' ? 'Activo' :
                                        project.status === 'inactive' ? 'Inactivo' :
                                            project.status === 'completed' ? 'Completado' :
                                                'Cancelado'}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Se eliminarán todos los datos asociados a este proyecto
                            permanentemente.
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
                            'Eliminar Proyecto'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

