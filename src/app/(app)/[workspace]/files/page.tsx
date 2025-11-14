import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import FilesPageClient from '@/components/ui/files/FilesPageClient';
import { routes } from '@/router/routes';
import { getFiles } from '@/lib/actions/files/get-files';

interface FilesPageProps {
    params: Promise<{
        workspace: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function FilesPage({ params, searchParams }: FilesPageProps) {
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

    const { files, total, totalPages } = await getFiles(company.id, currentPage, 10);

    return (
        <FilesPageClient
            companyId={company.id}
            initialFiles={files}
            initialTotal={total}
            initialTotalPages={totalPages}
            initialPage={currentPage}
        />
    );
}