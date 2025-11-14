import FilesView from './FilesView';
import SearchBar from '../SearchBar';
import CreateFileButton from './CreateFileButton';
import Pagination from '../Pagination';
import { getFiles } from '@/lib/actions/files/get-files';
import { FileText } from 'lucide-react';

interface FilesPageProps {
    companyId: string;
    page: number;
    query: string;
}

export default async function FilesPage({
    companyId,
    page,
    query,
}: FilesPageProps) {
    const { files, total, totalPages } = await getFiles(companyId, page, 10, query);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Archivos</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Gestiona y organiza todos tus archivos
                    </p>
                </div>
                <CreateFileButton companyId={companyId} />
            </div>

            <div className="rounded-xl border border-border/60 bg-card shadow-md overflow-hidden">
                <div className="bg-linear-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border-b-2 border-primary/30 px-6 py-4">
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
                        <SearchBar
                            placeholder="Buscar archivos por nombre, descripción o tipo..."
                            mode="url"
                        />
                    </div>

                    <FilesView files={files} />

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                        itemLabel="archivos"
                        scrollToTop={true}
                    />
                </div>
            </div>
        </div>
    );
}
