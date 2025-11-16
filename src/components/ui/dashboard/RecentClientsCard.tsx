'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { User, Mail, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { routes } from '@/router/routes';

interface RecentClient {
    id: string;
    name: string;
    email: string;
    type: string;
    createdAt: Date;
}

interface RecentClientsCardProps {
    clients: RecentClient[];
    workspace: string;
}

export default function RecentClientsCard({ clients, workspace }: RecentClientsCardProps) {
    if (clients.length === 0) {
        return (
            <Card className="border-border/60">
                <CardHeader>
                    <CardTitle>Últimos Clientes</CardTitle>
                    <CardDescription>Clientes agregados recientemente</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No hay clientes registrados aún
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle>Últimos Clientes</CardTitle>
                <CardDescription>Los 3 clientes más recientes agregados</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {clients.map((client) => (
                        <Link
                            key={client.id}
                            href={`/${workspace}${routes.clients}`}
                            className="block p-3 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                                        {client.type === 'company' ? (
                                            <Building2 className="h-4 w-4 text-primary" />
                                        ) : (
                                            <User className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">
                                            {client.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                                            <p className="text-xs text-muted-foreground truncate">
                                                {client.email}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground shrink-0">
                                    {client.type === 'company' ? 'Empresa' : 'Individual'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                    <Link
                        href={`/${workspace}${routes.clients}`}
                        className="text-sm text-primary hover:underline text-center block"
                    >
                        Ver todos los clientes →
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

