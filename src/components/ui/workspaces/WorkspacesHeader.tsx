'use client';

import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface WorkspacesHeaderProps {
    onOpenCreateModal: () => void;
}

export default function WorkspacesHeader({ onOpenCreateModal }: WorkspacesHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    Tus espacios de trabajo
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                    Selecciona un espacio de trabajo o crea uno nuevo
                </p>
            </div>
            <Button
                variant="primary"
                onClick={onOpenCreateModal}
                className="flex items-center gap-2 w-full sm:w-auto shrink-0 cursor-pointer"
            >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Crear empresa</span>
            </Button>
        </div>
    );
}

