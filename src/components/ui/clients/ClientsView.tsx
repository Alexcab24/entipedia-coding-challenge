'use client';

import { useState, useEffect } from 'react';
import ClientsTable from './ClientsTable';
import ClientsCardView from './ClientsCardView';
import DeleteClientDialog from './DeleteClientDialog';
import { Client } from '@/lib/actions/clients/get-clients';
import { updateClient } from '@/lib/actions/clients/update-client';
import { deleteClient } from '@/lib/actions/clients/delete-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ClientsViewProps {
    clients: Client[];
}

export default function ClientsView({
    clients,
}: ClientsViewProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [localClients, setLocalClients] = useState<Client[]>(clients);

    useEffect(() => {
        setLocalClients(clients);
    }, [clients]);

    const handleUpdate = async (clientId: string, field: string, value: string | null) => {
        try {
            if (field === 'value' && value) {
                const numericValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
                value = numericValue;
            }

            const result = await updateClient(clientId, field, value);
            if (result.status === 'success') {
                setLocalClients((prevClients) =>
                    prevClients.map((client) =>
                        client.id === clientId
                            ? { ...client, [field]: value }
                            : client
                    )
                );
                toast.success('Cliente actualizado exitosamente');
            } else {
                toast.error(result.message || 'Error al actualizar el cliente');
            }
        } catch (error) {
            console.error('Error updating client:', error);
            toast.error('Error al actualizar el cliente');
        }
    };

    const handleDeleteClick = (client: Client) => {
        setClientToDelete(client);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (clientId: string) => {
        const result = await deleteClient(clientId);
        if (result.status === 'success') {
            router.refresh();
            toast.success('Cliente eliminado exitosamente');
        } else {
            throw new Error(result.message || 'Error al eliminar el cliente');
        }
    };

    return (
        <>
            {/* Desktop: Table View */}
            <div className="hidden lg:block">
                <ClientsTable
                    clients={localClients}
                    onUpdate={handleUpdate}
                    onDelete={handleDeleteClick}
                />
            </div>

            {/* Mobile: Card View */}
            <div className="lg:hidden">
                <ClientsCardView
                    clients={localClients}
                    onUpdate={handleUpdate}
                    onDelete={handleDeleteClick}
                />
            </div>

            <DeleteClientDialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) {
                        setClientToDelete(null);
                    }
                }}
                client={clientToDelete}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}

