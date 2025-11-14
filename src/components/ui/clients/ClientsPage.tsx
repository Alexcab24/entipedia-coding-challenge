
import ClientsView from './ClientsView';
import ClientsSearchBar from './ClientsSearchBar';
import CreateClientButton from './CreateClientButton';
import ClientsPagination from './ClientsPagination';

import { getClients } from '@/lib/actions/clients/get-clients';

interface ClientsPageProps {
    companyId: string;
    page: number;
    query: string;
}

export default async function ClientsPage({
    companyId,
    page,
    query,
}: ClientsPageProps) {

    const { clients, total, totalPages } = await getClients(companyId, page, 10, query);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Clientes</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Gestiona tus clientes y su información
                    </p>
                </div>
                <CreateClientButton companyId={companyId} />
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
                            placeholder="Buscar clientes"
                        />
                    </div>

                    <ClientsView
                        clients={clients}
                    />

                    <ClientsPagination
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                    />
                </div>
            </div>
        </div>
    );
}
