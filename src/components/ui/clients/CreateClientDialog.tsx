'use client';

import { useEffect, useRef, useTransition } from 'react';
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
import { createClient } from '@/lib/actions/clients/create-client';
import { createClientInitialState } from '@/lib/actions/clients/create-client.types';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Calendar } from '../calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatDateToLocalString, parseLocalDateString } from '@/lib/utils/date';
import { Loader2 } from 'lucide-react';
import { CreateClientFormData, createClientFormSchema } from '@/lib/actions/clients/schemas/create-client.schema';
import { toast } from 'sonner';



interface CreateClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyId: string;
    onSuccess: () => void;
}

export default function CreateClientDialog({
    open,
    onOpenChange,
    companyId,
    onSuccess,
}: CreateClientDialogProps) {
    const [state, formAction, isPendingAction] = useActionState(
        createClient,
        createClientInitialState
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
    } = useForm<CreateClientFormData>({
        resolver: zodResolver(createClientFormSchema),
        defaultValues: {
            name: '',
            type: 'individual',
            email: '',
            phone: '',
            value: '',
            dateFrom: '',
            dateTo: '',
            notes: '',
        },
    });

    const dateFrom = watch('dateFrom');
    const dateTo = watch('dateTo');

    useEffect(() => {
        if (open) {
            processedSuccessRef.current = false;
        }
    }, [open]);

    useEffect(() => {
        if (state.status === 'success' && !processedSuccessRef.current && open) {
            processedSuccessRef.current = true;
            toast.success('Cliente creado exitosamente');
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

    const onSubmit = (data: CreateClientFormData) => {
        if (isPendingFinal || processedSuccessRef.current) {
            return;
        }

        const formData = new FormData();
        formData.append('companyId', companyId);
        formData.append('name', data.name);
        formData.append('type', data.type);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        if (data.value) formData.append('value', data.value);
        if (data.dateFrom) formData.append('dateFrom', data.dateFrom);
        if (data.dateTo) formData.append('dateTo', data.dateTo);
        if (data.notes) formData.append('notes', data.notes || '');

        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                    <DialogDescription>
                        Completa el formulario para agregar un nuevo cliente al sistema.
                    </DialogDescription>
                </DialogHeader>

                {state.status === 'error' && state.message && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                        {state.message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nombre *
                            </label>
                            <Input
                                {...register('name')}
                                error={errors.name?.message || state.fieldErrors?.name}
                                placeholder="Nombre del cliente"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tipo *
                            </label>
                            <Select
                                onValueChange={(value) => setValue('type', value as 'individual' | 'company')}
                                defaultValue="individual"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="individual">Persona</SelectItem>
                                    <SelectItem value="company">Compañía</SelectItem>
                                </SelectContent>
                            </Select>
                            {(errors.type || state.fieldErrors?.type) && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.type?.message || state.fieldErrors?.type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email *
                            </label>
                            <Input
                                type="email"
                                {...register('email')}
                                error={errors.email?.message || state.fieldErrors?.email}
                                placeholder="email@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Teléfono *
                            </label>
                            <Input
                                type="tel"
                                {...register('phone')}
                                error={errors.phone?.message || state.fieldErrors?.phone}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Valor (DOP)
                            </label>
                            <Input
                                type="text"
                                {...register('value')}
                                error={state.fieldErrors?.value}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Desde
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {dateFrom ? (
                                            format(parseLocalDateString(dateFrom), 'PPP', { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateFrom ? parseLocalDateString(dateFrom) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                setValue('dateFrom', formatDateToLocalString(date));
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {state.fieldErrors?.dateFrom && (
                                <p className="mt-1 text-sm text-destructive">
                                    {state.fieldErrors.dateFrom}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Hasta
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {dateTo ? (
                                            format(parseLocalDateString(dateTo), 'PPP', { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateTo ? parseLocalDateString(dateTo) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                setValue('dateTo', formatDateToLocalString(date));
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {state.fieldErrors?.dateTo && (
                                <p className="mt-1 text-sm text-destructive">
                                    {state.fieldErrors.dateTo}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Notas
                        </label>
                        <textarea
                            {...register('notes')}
                            className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                            rows={3}
                            placeholder="Notas adicionales..."
                        />
                        {state.fieldErrors?.notes && (
                            <p className="mt-1 text-sm text-destructive">
                                {state.fieldErrors.notes}
                            </p>
                        )}
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
                        <Button type="submit" variant="primary" disabled={isPendingFinal}>
                            {isPendingFinal ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Creando...
                                </>
                            ) : (
                                'Crear Cliente'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
