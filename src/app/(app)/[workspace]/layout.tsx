import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable, userCompaniesTable } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import WorkspaceHeader from '@/components/ui/app/Header';
import WorkspaceSidebar from '@/components/ui/app/Sidebar';
import WorkspaceMobileSidebar from '@/components/ui/app/MobileSidebar';

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        workspace: string;
    }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/');
    }

    const { workspace } = await params;
 
    const [company] = await db
        .select({
            id: companiesTable.id,
            name: companiesTable.name,
            workspace: companiesTable.workspace,
        })
        .from(companiesTable)
        .innerJoin(
            userCompaniesTable,
            eq(companiesTable.id, userCompaniesTable.companyId)
        )
        .where(
            and(
                eq(companiesTable.workspace, workspace),
                eq(userCompaniesTable.userId, session.user.id)
            )
        )
        .limit(1);

    if (!company) {
        redirect('/workspaces');
    }

    return (
        <div className="min-h-screen bg-background">
            <WorkspaceHeader
                workspaceName={company.name}
                userName={session.user.name || undefined}
            />
            <WorkspaceSidebar workspace={workspace} />
            <WorkspaceMobileSidebar workspace={workspace} />
            <main className="lg:pl-64 ">
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

