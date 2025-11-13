'use client';

import { useState, useEffect, useCallback } from 'react';
import FilesTable from './FilesTable';
import FilesCardView from './FilesCardView';
import CreateFileDialog from './CreateFileDialog';
import DeleteFileDialog from './DeleteFileDialog';
import Button from '../Button';
import { ChevronLeft, ChevronRight, Upload, FileText } from 'lucide-react';
import FilesSearchBar from './FilesSearchBar';
import { toast } from 'sonner';
import { mockFiles, File, FileType } from './mockFiles';

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

    const isUsingMockData = initialFiles.length === 0;
    const allFiles = isUsingMockData ? mockFiles : initialFiles;

    const [files, setFiles] = useState<File[]>(initialFiles.length > 0 ? initialFiles : allFiles);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(
        isUsingMockData ? Math.ceil(mockFiles.length / 10) : initialTotalPages
    );
    const [total, setTotal] = useState(isUsingMockData ? mockFiles.length : initialTotal);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');


    const searchFilteredFiles = allFiles.filter((file) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            file.name.toLowerCase().includes(query) ||
            (file.description?.toLowerCase().includes(query) ?? false) ||
            file.type.toLowerCase().includes(query)
        );
    });


    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredFiles = searchFilteredFiles.slice(startIndex, endIndex);
    const filteredTotalPages = Math.ceil(searchFilteredFiles.length / itemsPerPage);

    const handleCreateSuccess = useCallback(() => {
        // TODO: Implement when backend is ready

        window.location.reload();
    }, []);

    const handleDeleteClick = (file: File) => {
        setFileToDelete(file);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (fileId: string) => {
        // TODO: Implement when backend is ready

        setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
        setTotal((prevTotal) => prevTotal - 1);
        toast.success('Archivo eliminado exitosamente');
    };

    const handlePageChange = (newPage: number) => {
        const maxPages = searchQuery ? filteredTotalPages : totalPages;
        if (newPage >= 1 && newPage <= maxPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    useEffect(() => {
        if (isUsingMockData) {
            const itemsPerPage = 10;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginated = searchFilteredFiles.slice(startIndex, endIndex);
            const calculatedTotalPages = Math.ceil(searchFilteredFiles.length / itemsPerPage);
            setFiles(paginated);
            setTotalPages(calculatedTotalPages);
            setTotal(searchFilteredFiles.length);
        }
    }, [currentPage, searchQuery, isUsingMockData, searchFilteredFiles]);

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
                                    files={filteredFiles}
                                    onDelete={handleDeleteClick}
                                />
                            </div>

                            {/* Mobile: Card View */}
                            <div className="lg:hidden">
                                <FilesCardView
                                    files={filteredFiles}
                                    onDelete={handleDeleteClick}
                                />
                            </div>

                            {/* Pagination */}
                            {(searchQuery ? filteredTotalPages : totalPages) > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Página {currentPage} de {searchQuery ? filteredTotalPages : totalPages} ({searchQuery ? searchFilteredFiles.length : total} archivos)
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
                                            disabled={currentPage === (searchQuery ? filteredTotalPages : totalPages) || isLoading}
                                        >
                                            <span className="hidden sm:inline">Siguiente</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
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

