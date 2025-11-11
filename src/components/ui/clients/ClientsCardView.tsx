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
            <div className="text-center py-12 text-muted-foreground">
                <p>No hay clientes registrados</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
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

