import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getClients } from '@/lib/actions/clients/get-clients';
import ClientsPageClient from '@/components/ui/clients/ClientsPageClient';
import { routes } from '@/router/routes';

interface ClientsPageProps {
    params: Promise<{
        workspace: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function ClientsPage({ params, searchParams }: ClientsPageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect(routes.home);
    }

    const { workspace } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);


    const [company] = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.workspace, workspace))
        .limit(1);

    if (!company) {
        redirect(routes.workspaces);
    }


    const { clients, total, totalPages } = await getClients(company.id, currentPage, 10);

    return (
        <ClientsPageClient
            companyId={company.id}
            initialClients={clients}
            initialTotal={total}
            initialTotalPages={totalPages}
            initialPage={currentPage}
        />
    );
}