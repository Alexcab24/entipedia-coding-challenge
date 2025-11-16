'use client';

import { useActionState, useTransition } from 'react';
import { Building2, Globe, AlertCircle, Save } from 'lucide-react';
import Input from '../Input';
import Button from '../Button';
import { cn } from '@/lib/utils';
import { updateCompany } from '@/lib/actions/company/update-company';
import { updateCompanyInitialState } from '../../../lib/actions/company/update-company.types';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCompanySchema } from '@/lib/actions/company/schema/update-company.schema';

interface GeneralSectionProps {
    company: {
        id: string;
        name: string;
        workspace: string;
        description: string | null;
    };
}

interface UpdateCompanyFormData {
    companyId: string;
    name: string;
    description?: string;
}

export default function GeneralSection({ company }: GeneralSectionProps) {
    const [state, formAction, isPendingAction] = useActionState(
        updateCompany,
        updateCompanyInitialState
    );
    const [isPending, startTransition] = useTransition();
    const isPendingFinal = isPending || isPendingAction;

    const { register, handleSubmit: handleSubmitForm, formState: { errors }, control } = useForm<UpdateCompanyFormData>({
        resolver: zodResolver(updateCompanySchema),
        defaultValues: {
            companyId: company.id,
            name: company.name,
            description: company.description || undefined,
        },
    });

    const description = useWatch({ control, name: 'description' }) || '';

    const onSubmit = (data: UpdateCompanyFormData) => {
        const formData = new FormData();
        formData.append('companyId', data.companyId);
        formData.append('name', data.name);

        if (data.description && data.description.trim()) {
            formData.append('description', data.description.trim());
        }
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <form onSubmit={handleSubmitForm(onSubmit)} >
            <input type="hidden" {...register('companyId')} />
            <div className="space-y-6 rounded-lg">
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                        Información del Workspace
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Actualiza la información básica de tu workspace
                    </p>
                </div>

                <div className="space-y-4">
                    <Input
                        id="name"
                        label="Nombre del Workspace"
                        {...register('name')}
                        placeholder="Ej: Mi Empresa"
                        icon={<Building2 className="h-4 w-4" />}
                        error={errors.name?.message}
                        disabled={isPendingFinal}
                    />

                    <div className="space-y-2">
                        <Input
                            id="workspace"
                            label="Workspace URL"
                            value={company.workspace}
                            placeholder="mi-workspace"
                            icon={<Globe className="h-4 w-4" />}
                            disabled
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5" />
                            El workspace URL no puede ser modificado
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-foreground"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            {...register('description')}
                            placeholder="Describe tu workspace (opcional)"
                            rows={4}
                            maxLength={500}
                            disabled={isPendingFinal}
                            className={cn(
                                'flex w-full rounded-lg border border-secondary bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none',
                                errors.description && 'border-destructive'
                            )}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {description.length}/500 caracteres
                        </p>
                        {errors.description && (
                            <p className="text-xs text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                </div>

                {state.status === 'error' && state.message && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                        {state.message}
                    </div>
                )}

                {state.status === 'success' && state.message && (
                    <div className="rounded-lg border border-green-500/40 bg-green-50 p-3 text-sm text-green-900">
                        {state.message}
                    </div>
                )}

                <div className="pt-4 border-t border-border">
                    <Button variant="primary" size="lg" type="submit" disabled={isPendingFinal}>
                        {isPendingFinal ? (
                            <>
                                <Save className="h-4 w-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>

    );
}
