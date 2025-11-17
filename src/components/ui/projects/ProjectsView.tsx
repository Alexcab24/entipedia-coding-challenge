'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DeleteProjectDialog from './DeleteProjectDialog';
import EditProjectDialog from './EditProjectDialog';
const KanbanBoard = dynamic(() => import('./KanbanBoard'), {
    ssr: false,
});
import { Project, ProjectStatus } from '@/lib/actions/projects/get-projects';
import { updateProjectStatus } from '@/lib/actions/projects/update-project';
import { deleteProject } from '@/lib/actions/projects/delete-project';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProjectsViewProps {
    projects: Project[];
}

export default function ProjectsView({
    projects,
}: ProjectsViewProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [localProjects, setLocalProjects] = useState<Project[]>(projects);

    useEffect(() => {
        setLocalProjects(projects);
    }, [projects]);

    const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
        try {
            const result = await updateProjectStatus(projectId, newStatus);
            if (result.status === 'success') {
                setLocalProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project.id === projectId
                            ? { ...project, status: newStatus }
                            : project
                    )
                );
                toast.success('Proyecto actualizado exitosamente');
            } else {
                toast.error(result.message || 'Error al actualizar el proyecto');
                router.refresh();
            }
        } catch {
            toast.error('Error al actualizar el proyecto');
            router.refresh();
        }
    };

    const handleEditClick = (project: Project) => {
        setProjectToEdit(project);
        setIsEditDialogOpen(true);
    };

    const handleEditSuccess = () => {
        router.refresh();
        setProjectToEdit(null);
    };

    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (projectId: string) => {
        const result = await deleteProject(projectId);
        if (result.status === 'success') {
            router.refresh();
            toast.success('Proyecto eliminado exitosamente');
        } else {
            throw new Error(result.message || 'Error al eliminar el proyecto');
        }
    };

    return (
        <>
            <KanbanBoard
                projects={localProjects}
                onStatusChange={handleStatusChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

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
        </>
    );
}

