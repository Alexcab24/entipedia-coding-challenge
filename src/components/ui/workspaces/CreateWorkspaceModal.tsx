'use client';

import { useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import Input from '../Input';
import { Building2, Mail, Phone, X, Loader2 } from 'lucide-react';
import Button from '../Button';
import { createWorkspace } from '@/lib/actions/workspaces/create-workspace';
import { createWorkspaceInitialState } from '@/lib/actions/workspaces/create-workspace.types';
import { createWorkspaceSchema } from '@/lib/actions/workspaces/schemas/create-workspace.schema';
import type { CreateWorkspaceSchema } from '@/lib/actions/workspaces/schemas/create-workspace.schema';

interface CreateWorkspaceModalProps {
    showCreateModal: boolean;
    setShowCreateModal: (show: boolean) => void;
}

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                </>
            ) : (
                'Crear empresa'
            )}
        </Button>
    );
};

const CreateWorkspaceModal = ({ showCreateModal, setShowCreateModal }: CreateWorkspaceModalProps) => {
    const [state, formAction, isPendingAction] = useActionState(createWorkspace, createWorkspaceInitialState);
    const [isPending, startTransition] = useTransition();
    const isPendingFinal = isPending || isPendingAction;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: '',
            email: '',
            workspace: '',
            phone: '',
            description: '',
        },
    });

    const onSubmit = async (data: CreateWorkspaceSchema) => {
        if (isPendingFinal) {
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('workspace', data.workspace);
        formData.append('phone', data.phone);
        if (data.description) {
            formData.append('description', data.description);
        }

        startTransition(() => {
            formAction(formData);
        });
    };


    useEffect(() => {
        if (!showCreateModal) {
            reset();
        }
    }, [showCreateModal, reset]);

    if (!showCreateModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6" onClick={() => setShowCreateModal(false)}>
            <div
                className="bg-card rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Crear nueva empresa
                    </h2>
                    <button
                        onClick={() => setShowCreateModal(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                        disabled={isPendingFinal}
                        aria-label="Cerrar modal"
                    >
                        <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>

                {state.status === 'error' && state.message && (
                    <div className="mb-4 sm:mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 sm:p-4 text-xs sm:text-sm text-destructive">
                        <div className="flex items-start gap-2">
                            <span className="text-destructive font-semibold shrink-0">•</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium mb-1">Error al crear la empresa</p>
                                <p className="break-words">{state.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4" noValidate>
                    <Input
                        id="company-name"
                        label="Nombre de la empresa"
                        type="text"
                        placeholder="Mi Empresa S.A."
                        icon={<Building2 className="h-5 w-5" />}
                        error={errors.name?.message || state.fieldErrors?.name}
                        {...register('name')}
                        required
                    />

                    <Input
                        id="company-workspace"
                        label="Nombre del espacio de trabajo"
                        type="text"
                        placeholder="mi-empresa-sa"
                        icon={<Building2 className="h-5 w-5" />}
                        error={errors.workspace?.message || state.fieldErrors?.workspace}
                        {...register('workspace')}
                        required
                    />

                    <Input
                        id="company-email"
                        label="Correo de la empresa"
                        type="email"
                        placeholder="contacto@miempresa.com"
                        icon={<Mail className="h-5 w-5" />}
                        error={errors.email?.message || state.fieldErrors?.email}
                        {...register('email')}
                        required
                    />

                    <Input
                        id="company-phone"
                        label="Teléfono"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        icon={<Phone className="h-5 w-5" />}
                        error={errors.phone?.message || state.fieldErrors?.phone}
                        {...register('phone')}
                        required
                    />

                    <div className="w-full">
                        <label
                            htmlFor="company-description"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Descripción (opcional)
                        </label>
                        <textarea
                            id="company-description"
                            placeholder="Breve descripción de la empresa..."
                            rows={3}
                            className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                            {...register('description')}
                        />
                        {(errors.description?.message || state.fieldErrors?.description) && (
                            <p className="mt-1.5 text-sm text-destructive flex items-center gap-1.5">
                                <span className="text-destructive">•</span>
                                {errors.description?.message || state.fieldErrors?.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 "
                            disabled={isPendingFinal}
                        >
                            Cancelar
                        </Button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspaceModal;
