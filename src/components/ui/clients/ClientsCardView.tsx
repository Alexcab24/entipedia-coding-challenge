'use client';

import { Client } from '@/lib/actions/clients/get-clients';
import ClientCard from './ClientCard';

interface ClientsCardViewProps {
    clients: Client[];
    onDelete: (client: Client) => void;
    onUpdate: (clientId: string, field: string, value: string | null) => Promise<void>;
}

export default function ClientsCardView({
    clients,
    onDelete,
    onUpdate,
}: ClientsCardViewProps) {
    if (clients.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-base font-medium">No hay clientes registrados</p>
                    <p className="text-sm text-muted-foreground/70">Comienza agregando tu primer cliente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:gap-6">
            {clients.map((client) => (
                <ClientCard
                    key={client.id}
                    client={client}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
}

