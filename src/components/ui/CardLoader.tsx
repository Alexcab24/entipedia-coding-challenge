'use client';

import { Loader2 } from 'lucide-react';

export default function CardLoader() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Cargando datos...</p>
            </div>
        </div>
    );
}

