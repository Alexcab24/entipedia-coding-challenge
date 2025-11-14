'use client';

import { useState, useCallback } from 'react';
import Button from '../Button';
import { Upload } from 'lucide-react';
import CreateFileDialog from './CreateFileDialog';
import { useRouter } from 'next/navigation';

interface CreateFileButtonProps {
    companyId: string;
}

export default function CreateFileButton({ companyId }: CreateFileButtonProps) {
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
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
            >
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivo
            </Button>
            {isDialogOpen && (
                <CreateFileDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    companyId={companyId}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </>
    );
}

