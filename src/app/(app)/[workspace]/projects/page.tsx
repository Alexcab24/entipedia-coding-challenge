import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getProjects } from '@/lib/actions/projects/get-projects';
import ProjectsPageClient from '@/components/ui/projects/ProjectsPageClient';
import { routes } from '@/router/routes';

interface ProjectsPageProps {
    params: Promise<{
        workspace: string;
    }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
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

    const projects = await getProjects(company.id);

    return (
        <ProjectsPageClient
            companyId={company.id}
            initialProjects={projects}
        />
    );
}