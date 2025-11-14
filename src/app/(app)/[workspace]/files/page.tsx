import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import FilesPage from '@/components/ui/files/FilesPage';
import { routes } from '@/router/routes';

interface PageProps {
    params: Promise<{
        workspace: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function Page({ params, searchParams }: PageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect(routes.home);
    }

    const { workspace } = await params;
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);

    const [company] = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.workspace, workspace))
        .limit(1);

    if (!company) {
        redirect(routes.workspaces);
    }

    return (
        <FilesPage
            companyId={company.id}
            page={currentPage}
        />
    );
}