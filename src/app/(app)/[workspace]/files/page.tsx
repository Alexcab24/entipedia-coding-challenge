
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import FilesPageClient from '@/components/ui/files/FilesPageClient';
import { routes } from '@/router/routes';
import { mockFiles } from '@/components/ui/files/mockFiles';

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

    // Using mock data for UI preview
    // TODO: Replace with real data when backend is ready
    const itemsPerPage = 10;
    const totalMockFiles = mockFiles.length;
    const totalPages = Math.ceil(totalMockFiles / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMockFiles = mockFiles.slice(startIndex, endIndex);

    return (
        <FilesPageClient
            companyId={company.id}
            initialFiles={paginatedMockFiles}
            initialTotal={totalMockFiles}
            initialTotalPages={totalPages}
            initialPage={currentPage}
        />
    );
}