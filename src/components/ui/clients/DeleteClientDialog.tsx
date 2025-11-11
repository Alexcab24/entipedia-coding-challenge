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
import { Client } from '@/lib/actions/clients/get-clients';
import { toast } from 'sonner';

interface DeleteClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client: Client | null;
    onConfirm: (clientId: string) => Promise<void>;
}

export default function DeleteClientDialog({
    open,
    onOpenChange,
    client,
    onConfirm,
}: DeleteClientDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        if (!client) return;

        startTransition(async () => {
            try {
                await onConfirm(client.id);
                toast.success('Cliente eliminado exitosamente');
                onOpenChange(false);
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : 'Error al eliminar el cliente';
                toast.error(errorMessage);
            }
        });
    };

    const handleCancel = () => {
        if (!isPending) {
            onOpenChange(false);
        }
    };

    if (!client) return null;

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle>Eliminar Cliente</DialogTitle>
                            <DialogDescription className="mt-1">
                                Esta acción no se puede deshacer
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <p className="text-sm text-foreground">
                            ¿Estás seguro de que deseas eliminar el siguiente cliente?
                        </p>
                        <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                            <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Nombre:
                                </span>
                                <p className="text-sm font-medium text-foreground">
                                    {client.name}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Email:
                                </span>
                                <p className="text-sm text-foreground">
                                    {client.email}
                                </p>
                            </div>
                            {client.type && (
                                <div>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Tipo:
                                    </span>
                                    <p className="text-sm text-foreground">
                                        {client.type === 'individual'
                                            ? 'Persona'
                                            : 'Compañía'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Se eliminarán todos los datos asociados a este cliente
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
                            'Eliminar Cliente'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

