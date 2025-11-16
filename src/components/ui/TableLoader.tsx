'use client';

import { Loader2 } from 'lucide-react';
import { TableBody, TableCell, TableRow } from './table';

interface TableLoaderProps {
    columns?: number;
}

export default function TableLoader({ columns = 4 }: TableLoaderProps) {
    return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={columns} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Cargando datos...</p>
                    </div>
                </TableCell>
            </TableRow>
        </TableBody>
    );
}

