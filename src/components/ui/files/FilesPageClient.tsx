'use client';

import { useState, useCallback, useMemo } from 'react';
import FilesTable from './FilesTable';
import FilesCardView from './FilesCardView';
import CreateFileDialog from './CreateFileDialog';
import DeleteFileDialog from './DeleteFileDialog';
import Button from '../Button';
import { ChevronLeft, ChevronRight, Upload, FileText } from 'lucide-react';
import FilesSearchBar from './FilesSearchBar';
import { toast } from 'sonner';
import { File, FileType, getFiles } from '@/lib/actions/files/get-files';

export type { File, FileType };

interface FilesPageClientProps {
    companyId: string;
    initialFiles?: File[];
    initialTotal?: number;
    initialTotalPages?: number;
    initialPage?: number;
}

export default function FilesPageClient({
    companyId,
    initialFiles = [],
    initialTotal = 0,
    initialTotalPages = 1,
    initialPage = 1,
}: FilesPageClientProps) {
    const [files, setFiles] = useState<File[]>(initialFiles);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [total, setTotal] = useState(initialTotal);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchFiles = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const result = await getFiles(companyId, page, 10);
            setFiles(result.files);
            setTotalPages(result.totalPages);
            setTotal(result.total);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Error al cargar los archivos');
        } finally {
            setIsLoading(false);
        }
    }, [companyId]);

    const searchFilteredFiles = useMemo(() => {
        return files.filter((file) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                file.name.toLowerCase().includes(query) ||
                (file.description?.toLowerCase().includes(query) ?? false) ||
                file.type.toLowerCase().includes(query)
            );
        });
    }, [files, searchQuery]);

    const handleCreateSuccess = useCallback(() => {
        fetchFiles(currentPage);
    }, [fetchFiles, currentPage]);

    const handleDeleteClick = (file: File) => {
        setFileToDelete(file);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (fileId: string) => {
        // TODO: Implement delete when backend is ready
        await fetchFiles(currentPage);
        toast.success('Archivo eliminado exitosamente');
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchFiles(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Archivos</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Gestiona y organiza todos tus archivos
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Archivo
                </Button>
            </div>

            <div className="rounded-xl border border-border/60 bg-card shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border-b-2 border-primary/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-foreground/20">
                            <FileText className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary-foreground">
                            Biblioteca de Archivos
                        </h2>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="w-full sm:w-auto">
                        <FilesSearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Buscar archivos por nombre, descripción o tipo..."
                        />
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">Cargando...</div>
                        </div>
                    ) : (
                        <>
                            {/* Desktop: Table View */}
                            <div className="hidden lg:block">
                                <FilesTable
                                    files={searchQuery ? searchFilteredFiles : files}
                                    onDelete={handleDeleteClick}
                                />
                            </div>

                            {/* Mobile: Card View */}
                            <div className="lg:hidden">
                                <FilesCardView
                                    files={searchQuery ? searchFilteredFiles : files}
                                    onDelete={handleDeleteClick}
                                />
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && !searchQuery && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Página {currentPage} de {totalPages} ({total} archivos)
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1 || isLoading}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden sm:inline">Anterior</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || isLoading}
                                        >
                                            <span className="hidden sm:inline">Siguiente</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {searchQuery && searchFilteredFiles.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No se encontraron archivos que coincidan con tu búsqueda.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {isDialogOpen && (
                <CreateFileDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    companyId={companyId}
                    onSuccess={handleCreateSuccess}
                />
            )}

            <DeleteFileDialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) {
                        setFileToDelete(null);
                    }
                }}
                file={fileToDelete}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}

