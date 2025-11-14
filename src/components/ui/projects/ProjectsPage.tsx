import ProjectsView from './ProjectsView';
import CreateProjectButton from './CreateProjectButton';
import { getProjects } from '@/lib/actions/projects/get-projects';

interface ProjectsPageProps {
    companyId: string;
}

export default async function ProjectsPage({
    companyId,
}: ProjectsPageProps) {
    const projects = await getProjects(companyId);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Proyectos</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Gestiona tus proyectos con el tablero Kanban
                    </p>
                </div>
                <CreateProjectButton companyId={companyId} />
            </div>

            <div className="rounded-xl border border-border/60 bg-card shadow-md overflow-hidden">
                <div className="bg-primary/50 backdrop-blur-md border-b-2 border-primary/30 px-6 py-4">
                    <h2 className="text-2xl font-bold text-primary-foreground">
                        Tablero Kanban
                    </h2>
                </div>
                <div className="p-6">
                    <ProjectsView projects={projects} />
                </div>
            </div>
        </div>
    );
}

