'use client';

import { useEffect, useRef, useTransition, useMemo } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../dialog';
import Button from '../Button';
import Input from '../Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../select';
import { updateProject } from '@/lib/actions/projects/update-project';
import { updateProjectInitialState, UpdateProjectFormData } from '@/lib/actions/projects/update-project.types';
import { Loader2 } from 'lucide-react';
import { CreateProjectFormData, createProjectFormSchema } from '@/lib/actions/projects/schemas/create-project.schema';
import { toast } from 'sonner';
import { Project } from '@/lib/actions/projects/get-projects';

interface EditProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onSuccess: () => void;
}

export default function EditProjectDialog({
    open,
    onOpenChange,
    project,
    onSuccess,
}: EditProjectDialogProps) {
 
    const updateProjectAction = useMemo(
        () => async (prevState: UpdateProjectFormData, formData: FormData): Promise<UpdateProjectFormData> => {
            if (!project) {
                return {
                    ...updateProjectInitialState,
                    status: 'error',
                    message: 'Proyecto no encontrado',
                };
            }
            return updateProject(project.id, formData);
        },
        [project]
    );

    const [state, formAction, isPendingAction] = useActionState(
        updateProjectAction,
        updateProjectInitialState
    );
    const [isPending, startTransition] = useTransition();
    const isPendingFinal = isPending || isPendingAction;
    const processedSuccessRef = useRef(false);
    const onSuccessRef = useRef(onSuccess);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectFormSchema),
        defaultValues: {
            name: project?.name || '',
            description: project?.description || '',
            status: project?.status || 'active',
            priority: project?.priority || 'medium',
        },
    });


    useEffect(() => {
        if (project && open) {
            reset({
                name: project.name || '',
                description: project.description || '',
                status: project.status || 'active',
                priority: project.priority || 'medium',
            });
            setValue('status', project.status || 'active');
            setValue('priority', project.priority || 'medium');
        }
    }, [project, open, reset, setValue]);

    useEffect(() => {
        if (open) {
            processedSuccessRef.current = false;
        }
    }, [open]);

    useEffect(() => {
        if (state.status === 'success' && !processedSuccessRef.current && open) {
            processedSuccessRef.current = true;
            toast.success('Proyecto actualizado exitosamente');
            onOpenChange(false);
            reset();
            setTimeout(() => {
                onSuccessRef.current();
            }, 150);
        }
    }, [state.status, open, onOpenChange, reset]);

    useEffect(() => {
        if (!open) {
            reset();
            processedSuccessRef.current = false;
        }
    }, [open, reset]);

    const onSubmit = (data: CreateProjectFormData) => {
        if (isPendingFinal || processedSuccessRef.current || !project) {
            return;
        }

        const formData = new FormData();
        formData.append('companyId', project.companyId);
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('status', data.status);
        formData.append('priority', data.priority);

        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Proyecto</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del proyecto.
                    </DialogDescription>
                </DialogHeader>

                {state.status === 'error' && state.message && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                        {state.message}
                    </div>
                )}

                <form
                    // eslint-disable-next-line react-hooks/refs
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Nombre *
                        </label>
                        <Input
                            {...register('name')}
                            error={errors.name?.message || state.fieldErrors?.name}
                            placeholder="Nombre del proyecto"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Descripción
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder="Descripción del proyecto"
                            rows={4}
                            className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                        />
                        {(errors.description || state.fieldErrors?.description) && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.description?.message || state.fieldErrors?.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Estatus *
                            </label>
                            <Select
                                value={watch('status')}
                                onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'completed' | 'cancelled')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estatus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                    <SelectItem value="completed">Completado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                            {(errors.status || state.fieldErrors?.status) && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.status?.message || state.fieldErrors?.status}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Prioridad *
                            </label>
                            <Select
                                value={watch('priority')}
                                onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high' | 'urgent')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                    <SelectItem value="urgent">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                            {(errors.priority || state.fieldErrors?.priority) && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.priority?.message || state.fieldErrors?.priority}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPendingFinal}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={isPendingFinal || !project}>
                            {isPendingFinal ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Actualizando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

