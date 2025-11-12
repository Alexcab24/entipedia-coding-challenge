'use client';

import { useState, useCallback } from 'react';
import ClientsTable from './ClientsTable';
import ClientsCardView from './ClientsCardView';
import CreateClientDialog from './CreateClientDialog';
import DeleteClientDialog from './DeleteClientDialog';
import { Client, getClients } from '@/lib/actions/clients/get-clients';
import { updateClient } from '@/lib/actions/clients/update-client';
import { deleteClient } from '@/lib/actions/clients/delete-client';
import Button from '../Button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import ClientsSearchBar from './ClientsSearchBar';
import { toast } from 'sonner';

interface ClientsPageClientProps {
    companyId: string;
    initialClients: Client[];
    initialTotal: number;
    initialTotalPages: number;
    initialPage: number;
}

export default function ClientsPageClient({
    companyId,
    initialClients,
    initialTotal,
    initialTotalPages,
    initialPage,
}: ClientsPageClientProps) {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [total, setTotal] = useState(initialTotal);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchClients = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const result = await getClients(companyId, page, 10);
            setClients(result.clients);
            setTotalPages(result.totalPages);
            setTotal(result.total);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId]);

    const handleCreateSuccess = useCallback(() => {
        fetchClients(1);
    }, [fetchClients]);

    const handleUpdate = async (clientId: string, field: string, value: string | null) => {
        try {
            if (field === 'value' && value) {
                const numericValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
                value = numericValue;
            }

            const result = await updateClient(clientId, field, value);
            if (result.status === 'success') {
                setClients((prevClients) =>
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
            await fetchClients(currentPage);
        } else {
            throw new Error(result.message || 'Error al eliminar el cliente');
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchClients(newPage);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Clientes</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Gestiona tus clientes y su información
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Cliente
                </Button>
            </div>

            <div className="rounded-xl border border-border/60 bg-card shadow-md overflow-hidden">
                <div className="bg-primary/50 backdrop-blur-md border-b-2 border-primary/30 px-6 py-4">
                    <h2 className="text-2xl font-bold text-primary-foreground">
                        Lista de Clientes
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="w-full sm:w-auto">
                        <ClientsSearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Buscar clientes"
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
                                <ClientsTable
                                    clients={clients}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDeleteClick}
                                />
                            </div>


                            {/* Mobile: Card View */}
                            <div className="lg:hidden">
                                <ClientsCardView
                                    clients={clients}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDeleteClick}
                                />
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Página {currentPage} de {totalPages}
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
                        </>
                    )}
                </div>
            </div>

            {isDialogOpen && (
                <CreateClientDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    companyId={companyId}
                    onSuccess={handleCreateSuccess}
                />
            )}

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
        </div>
    );
}

