'use client';

import { useState, useEffect, useRef, useTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Loader2, Upload, Link2, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { FileType } from './FilesPageClient';
import { uploadFile } from '@/lib/actions/files/upload-file';
import { uploadFileInitialState } from '@/lib/actions/files/upload-file.types';


interface CreateFileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyId: string;
    onSuccess: () => void;
}

interface CreateFileFormData {
    name: string;
    description: string;
    type: FileType;
    url: string;
    file?: FileList;
}

type UploadMethod = 'file' | 'url';

export default function CreateFileDialog({
    open,
    onOpenChange,
    companyId,
    onSuccess,
}: CreateFileDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [uploadMethod, setUploadMethod] = useState<UploadMethod>('file');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    console.log('selectedFile', selectedFile?.type);
    const processedSuccessRef = useRef(false);
    const onSuccessRef = useRef(onSuccess);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, formAction, isPendingAction] = useActionState(
        uploadFile,
        uploadFileInitialState
    );
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
    } = useForm<CreateFileFormData>({
        defaultValues: {
            name: '',
            description: '',
            type: 'other',
            url: '',
        },
    });

    const fileType = watch('type');
  

    useEffect(() => {
        if (open) {
            processedSuccessRef.current = false;
        }
    }, [open]);

    useEffect(() => {
        if (!open) {
            reset();
            setSelectedFile(null);
            setUploadMethod('file');
            processedSuccessRef.current = false;
        }
    }, [open, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {

            //deteccion automatica de nombre y tipo de archivo
            setSelectedFile(file);
            setValue('name', file.name);

            const extension = file.type.split('/')[1];
            console.log('extension: ', extension);
            if (extension === 'pdf') setValue('type', 'pdf');
            else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) setValue('type', 'image');
            else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) setValue('type', 'video');
            else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension || '')) setValue('type', 'audio');
            else if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) setValue('type', 'document');
            else setValue('type', 'other');
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setValue('name', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = (data: CreateFileFormData) => {
        if (isPending || processedSuccessRef.current) {
            return;
        }

        const formData = new FormData();
        formData.append('companyId', companyId);
        formData.append('name', data.name);
        formData.append('type', data.type);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        formData.append('url', data.url || '');
        if (data.description) formData.append('description', data.description);

        startTransition(async () => {
            try {
                // const result = await uploadFile(uploadFileInitialState, formData);





                // TODO: Implement when backend is ready

                formAction(formData);

                processedSuccessRef.current = true;
                toast.success('Archivo creado exitosamente');
                onOpenChange(false);
                reset();
                setSelectedFile(null);
                setUploadMethod('file');
                setTimeout(() => {
                    onSuccessRef.current();
                }, 150);
            } catch (error) {
                console.error('Error creating file:', error);
                toast.error('Error al crear el archivo');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {state.status === 'error' && state.message && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    {state.message}
                </div>
            )}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Subir Archivo
                    </DialogTitle>
                    <DialogDescription>
                        Sube un archivo desde tu dispositivo o agrega una URL externa.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Upload Method Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setUploadMethod('file')}
                            className={`p-4 rounded-xl border-2 transition-all ${uploadMethod === 'file'
                                ? 'border-primary bg-primary/10 shadow-md'
                                : 'border-border hover:border-primary/50 bg-background'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Upload className={`h-6 w-6 ${uploadMethod === 'file' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`font-semibold ${uploadMethod === 'file' ? 'text-primary' : 'text-foreground'}`}>
                                    Subir Archivo
                                </span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setUploadMethod('url')}
                            className={`p-4 rounded-xl border-2 transition-all ${uploadMethod === 'url'
                                ? 'border-primary bg-primary/10 shadow-md'
                                : 'border-border hover:border-primary/50 bg-background'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Link2 className={`h-6 w-6 ${uploadMethod === 'url' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`font-semibold ${uploadMethod === 'url' ? 'text-primary' : 'text-foreground'}`}>
                                    Agregar URL
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* File Upload Section */}
                    {uploadMethod === 'file' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Seleccionar archivo *
                                </label>
                                {!selectedFile ? (
                                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-sm font-medium text-foreground mb-1">
                                                Haz clic para seleccionar un archivo
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                o arrastra y suelta aquí
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="border-2 border-primary/30 rounded-xl p-4 bg-primary/5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <FileText className="h-8 w-8 text-primary shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground truncate">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemoveFile}
                                                className="hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* URL Input Section */}
                    {uploadMethod === 'url' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                URL del archivo *
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                                    <Link2 className="h-4 w-4" />
                                </div>
                                <Input
                                    {...register('url', {
                                        required: uploadMethod === 'url' ? 'La URL es requerida' : false,
                                        pattern: uploadMethod === 'url' ? {
                                            value: /^https?:\/\/.+/,
                                            message: 'Debe ser una URL válida (http:// o https://)'
                                        } : undefined
                                    })}
                                    error={errors.url?.message}
                                    placeholder="https://ejemplo.com/archivo.pdf"
                                    type="url"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    )}

                    {/* File Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Nombre del archivo *
                        </label>
                        <Input
                            {...register('name', { required: 'El nombre es requerido' })}
                            error={errors.name?.message}
                            placeholder={uploadMethod === 'file' ? 'El nombre se detectará automáticamente' : 'Ej: Documento importante.pdf'}
                            disabled={uploadMethod === 'file' && !!selectedFile}
                        />
                    </div>

                    {/* File Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tipo de archivo *
                        </label>
                        <Select
                            onValueChange={(value) => setValue('type', value as FileType)}
                            defaultValue={fileType || 'other'}
                            value={fileType || 'other'}
                            disabled={uploadMethod === 'file' && !!selectedFile}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="image">Imagen</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="document">Documento</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.type.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Descripción <span className="text-muted-foreground font-normal">(opcional)</span>
                        </label>
                        <textarea
                            {...register('description')}
                            className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                            rows={3}
                            placeholder="Agrega una descripción para este archivo..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={isPending || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !watch('url'))}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Subir Archivo
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

