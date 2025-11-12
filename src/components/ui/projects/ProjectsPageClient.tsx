'use client';

import { useState, useCallback } from 'react';
import KanbanBoard from './KanbanBoard';
import CreateProjectDialog from './CreateProjectDialog';
import DeleteProjectDialog from './DeleteProjectDialog';
import { Project, ProjectStatus, getProjects } from '@/lib/actions/projects/get-projects';
import { updateProjectStatus } from '@/lib/actions/projects/update-project';
import { deleteProject } from '@/lib/actions/projects/delete-project';
import Button from '../Button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import EditProjectDialog from './EditProjectDialog';

interface ProjectsPageClientProps {
    companyId: string;
    initialProjects: Project[];
}

export default function ProjectsPageClient({
    companyId,
    initialProjects,
}: ProjectsPageClientProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getProjects(companyId);
            setProjects(result);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Error al cargar los proyectos');
        } finally {
            setIsLoading(false);
        }
    }, [companyId]);

    const handleCreateSuccess = useCallback(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
        try {
            const result = await updateProjectStatus(projectId, newStatus);
            if (result.status === 'success') {
                setProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project.id === projectId
                            ? { ...project, status: newStatus }
                            : project
                    )
                );
                toast.success('Proyecto actualizado exitosamente');
            } else {
                toast.error(result.message || 'Error al actualizar el proyecto');

                await fetchProjects();
            }
        } catch (error) {
            console.error('Error updating project status:', error);
            toast.error('Error al actualizar el proyecto');

            await fetchProjects();
        }
    };

    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project);
        setIsDeleteDialogOpen(true);
    };

    const handleEditClick = (project: Project) => {
        setProjectToEdit(project);
        setIsEditDialogOpen(true);
    };

    const handleEditSuccess = useCallback(() => {
        fetchProjects();
        setProjectToEdit(null);
    }, [fetchProjects]);

    const handleDeleteConfirm = async (projectId: string) => {
        const result = await deleteProject(projectId);
        if (result.status === 'success') {
            await fetchProjects();
        } else {
            throw new Error(result.message || 'Error al eliminar el proyecto');
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Proyectos</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Gestiona tus proyectos con el tablero Kanban
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Proyecto
                </Button>
            </div>

            <div className="rounded-xl border border-border/60 bg-card shadow-md overflow-hidden">
                <div className="bg-primary/50 backdrop-blur-md border-b-2 border-primary/30 px-6 py-4">
                    <h2 className="text-2xl font-bold text-primary-foreground">
                        Tablero Kanban
                    </h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">Cargando...</div>
                        </div>
                    ) : (
                        <KanbanBoard
                            projects={projects}
                            onStatusChange={handleStatusChange}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    )}
                </div>
            </div>

            {isDialogOpen && (
                <CreateProjectDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    companyId={companyId}
                    onSuccess={handleCreateSuccess}
                />
            )}

            <DeleteProjectDialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) {
                        setProjectToDelete(null);
                    }
                }}
                project={projectToDelete}
                onConfirm={handleDeleteConfirm}
            />

            <EditProjectDialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) {
                        setProjectToEdit(null);
                    }
                }}
                project={projectToEdit}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}

