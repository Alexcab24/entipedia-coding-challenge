'use client';

import { useState, useCallback } from 'react';
import Button from '../Button';
import { Plus } from 'lucide-react';
import CreateClientDialog from './CreateClientDialog';
import { useRouter } from 'next/navigation';

interface CreateClientButtonProps {
    companyId: string;
}

export default function CreateClientButton({ companyId }: CreateClientButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const handleCreateSuccess = useCallback(() => {
        router.refresh();
    }, [router]);

    return (
        <>
            <Button
                variant="primary"
                onClick={() => setIsDialogOpen(true)}
                className="w-full sm:w-auto"
            >
                <Plus className="h-4 w-4 mr-2" />
                Crear Cliente
            </Button>
            {isDialogOpen && (
                <CreateClientDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    companyId={companyId}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </>
    );
}

