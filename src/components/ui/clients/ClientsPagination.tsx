'use client';

import Button from '../Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ClientsPaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
}

export default function ClientsPagination({
    currentPage,
    totalPages,
    total,
}: ClientsPaginationProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const params = new URLSearchParams(searchParams);
            params.set('page', newPage.toString());
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} ({total} clientes)
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

