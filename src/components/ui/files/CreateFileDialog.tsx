/* eslint-disable react-hooks/incompatible-library */
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
import { uploadFile } from '@/lib/actions/files/upload-file';
import { uploadFileInitialState } from '@/lib/actions/files/upload-file.types';


interface CreateFileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyId: string;
    onSuccess: () => void;
}
type FileType = 'pdf' | 'image' | 'video' | 'audio' | 'document' | 'other';
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
    const [isDragging, setIsDragging] = useState(false);
    const processedSuccessRef = useRef(false);
    const onSuccessRef = useRef(onSuccess);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const [state, formAction] = useActionState(
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
            setIsDragging(false);
            processedSuccessRef.current = false;
        }
    }, [open, reset]);

    useEffect(() => {
        if (state.status === 'error' && state.message && !processedSuccessRef.current) {
            toast.error(state.message || 'Error al crear el archivo');
            processedSuccessRef.current = true;
        }

        if (state.status === 'success' && !processedSuccessRef.current) {
            processedSuccessRef.current = true;
            toast.success('Archivo creado exitosamente');
            onOpenChange(false);
            reset();
            setSelectedFile(null);
            setUploadMethod('file');
            setTimeout(() => {
                onSuccessRef.current();
            }, 150);
        }
    }, [state, onOpenChange, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!(file instanceof File)) {
                toast.error('Tipo de archivo no válido');
                return;
            }
            processFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setValue('name', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    const processFile = (file: File) => {

        if (file.size === 0) {
            toast.error('El archivo está vacío');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error(`El archivo es demasiado grande. El tamaño máximo es ${MAX_FILE_SIZE / 1024 / 1024}MB`);
            return;
        }

        if (!file.type || !file.name) {
            toast.error('El archivo no es válido');
            return;
        }

        setSelectedFile(file);
        setValue('name', file.name);

        const mimeType = file.type?.toLowerCase() || '';
        const extension = file.name.split('.').pop()?.toLowerCase() || '';

        const isPdf = extension === 'pdf' || mimeType === 'application/pdf';
        const isImage =
            ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension) ||
            mimeType.startsWith('image/');
        const isVideo =
            ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(extension) ||
            mimeType.startsWith('video/');
        const isAudio =
            ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(extension) ||
            mimeType.startsWith('audio/');
        const isDocument =
            ['doc', 'docx', 'txt', 'rtf', 'odt', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension) ||
            [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/rtf',
                'text/plain',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            ].includes(mimeType);

        if (isPdf) setValue('type', 'pdf');
        else if (isImage) setValue('type', 'image');
        else if (isVideo) setValue('type', 'video');
        else if (isAudio) setValue('type', 'audio');
        else if (isDocument) setValue('type', 'document');
        else setValue('type', 'other');
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types.includes('Files')) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types.includes('Files')) {
            e.dataTransfer.dropEffect = 'copy';
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];


            if (!(file instanceof File)) {
                toast.error('Tipo de archivo no válido');
                return;
            }


            if (uploadMethod === 'url') {
                setUploadMethod('file');
            }

            processFile(file);
        }
    };

    const onSubmit = (data: CreateFileFormData) => {
        if (isPending || processedSuccessRef.current) {
            return;
        }


        if (uploadMethod === 'file' && !selectedFile) {
            toast.error('Por favor selecciona un archivo');
            return;
        }

        if (uploadMethod === 'url' && !data.url) {
            toast.error('Por favor proporciona una URL');
            return;
        }

        const formData = new FormData();
        formData.append('companyId', companyId);
        formData.append('name', data.name);
        formData.append('type', data.type);


        if (uploadMethod === 'file' && selectedFile) {

            if (!(selectedFile instanceof File) || selectedFile.size === 0) {
                toast.error('El archivo no es válido');
                return;
            }
            formData.append('file', selectedFile, selectedFile.name);
        } else if (uploadMethod === 'url' && data.url) {
            formData.append('url', data.url.trim());
        }

        if (data.description && data.description.trim()) {
            formData.append('description', data.description.trim());
        }

        startTransition(() => {
            try {
                formAction(formData);
            } catch (error) {
                toast.error(`Error al crear el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            {state.status === 'error' && state.message && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    {state.message}
                </div>
            )}
            <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg">
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
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer duration-300 ${uploadMethod === 'file'
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
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer duration-300 ${uploadMethod === 'url'
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
                                    <div
                                        ref={dropZoneRef}
                                        onDragEnter={handleDragEnter}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging
                                            ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg'
                                            : 'border-border hover:border-primary/50 bg-muted/30'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer block">
                                            <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-primary scale-110' : 'text-muted-foreground'
                                                }`} />
                                            <p className={`text-sm font-medium mb-1 transition-colors ${isDragging ? 'text-primary' : 'text-foreground'
                                                }`}>
                                                {isDragging ? 'Suelta el archivo aquí' : 'Haz clic para seleccionar un archivo'}
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

                    <DialogFooter >
                        <Button
                            type="button"
                            className="cursor-pointer"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={isPending || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !watch('url'))} className="cursor-pointer">
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

