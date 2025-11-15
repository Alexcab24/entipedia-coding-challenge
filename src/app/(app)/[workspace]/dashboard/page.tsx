import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { companiesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getDashboardStats } from '@/lib/actions/dashboard/get-dashboard-stats';
import DashboardCard from '@/components/ui/dashboard/DashboardCard';
import { FolderKanban, Users, FileText, LayoutDashboard } from 'lucide-react';
import { routes } from '@/router/routes';


interface DashboardPageProps {
    params: Promise<{
        workspace: string;
    }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/');
    }

    const { workspace } = await params;

    // Get workspace details
    const [company] = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.workspace, workspace))
        .limit(1);

    if (!company) {
        redirect(routes.workspaces);
    }

    const stats = await getDashboardStats(company.id);

    return (
        <div className="w-full space-y-8 pb-8">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Vista general de {company.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <DashboardCard
                    title="Total de Proyectos"
                    value={stats.totalProjects}
                    icon={FolderKanban}
                    href={`/${workspace}${routes.projects}`}
                    description="Proyectos en el workspace"
                    iconBgColor="bg-blue-500/10"
                    iconColor="text-blue-600 dark:text-blue-400"
                />
                <DashboardCard
                    title="Total de Clientes"
                    value={stats.totalMembers}
                    icon={Users}
                    href={`/${workspace}${routes.clients}`}
                    description="Clientes en el workspace"
                    iconBgColor="bg-green-500/10"
                    iconColor="text-green-600 dark:text-green-400"
                />
                <DashboardCard
                    title="Archivos Subidos"
                    value={stats.totalFiles}
                    icon={FileText}
                    href={`/${workspace}${routes.files}`}
                    description="Archivos almacenados"
                    iconBgColor="bg-purple-500/10"
                    iconColor="text-purple-600 dark:text-purple-400"
                />
            </div>

        </div>
    );
}

