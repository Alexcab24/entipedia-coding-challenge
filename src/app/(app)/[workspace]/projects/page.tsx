import { Suspense } from 'react';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ProjectsPage from '@/components/ui/projects/ProjectsPage';
import PageLoading from '@/components/ui/PageLoading';
import { routes } from '@/router/routes';

interface PageProps {
    params: Promise<{
        workspace: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect(routes.home);
    }

    const { workspace } = await params;

    const [company] = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.workspace, workspace))
        .limit(1);

    if (!company) {
        redirect(routes.workspaces);
    }

    return (
        <Suspense fallback={<PageLoading text="Cargando proyectos..." />}>
            <ProjectsPage companyId={company.id} />
        </Suspense>
    );
}