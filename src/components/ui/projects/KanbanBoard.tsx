'use client';

import { useMemo, useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import { Project, ProjectStatus } from '@/lib/actions/projects/get-projects';
import ProjectCard from './ProjectCard';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
    projects: Project[];
    onStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
    onDelete: (project: Project) => void;
    onEdit?: (project: Project) => void;
}

const statusConfig: Record<
    ProjectStatus,
    { label: string }
> = {
    active: { label: 'Activo' },
    inactive: { label: 'Inactivo' },
    completed: { label: 'Completado' },
    cancelled: { label: 'Cancelado' },
};

const statusOrder: ProjectStatus[] = ['active', 'inactive', 'completed', 'cancelled'];

export default function KanbanBoard({
    projects,
    onStatusChange,
    onDelete,
    onEdit,
}: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        })
    );

    const projectsByStatus = useMemo(() => {
        const grouped: Record<ProjectStatus, Project[]> = {
            active: [],
            inactive: [],
            completed: [],
            cancelled: [],
        };

        projects.forEach((project) => {
            grouped[project.status].push(project);
        });

        return grouped;
    }, [projects]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const projectId = active.id as string;
        const overId = over.id as string;


        let newStatus: ProjectStatus | null = null;
        if (statusOrder.includes(overId as ProjectStatus)) {
            newStatus = overId as ProjectStatus;
        } else {

            const targetProject = projects.find((p) => p.id === overId);
            if (targetProject) {
                newStatus = targetProject.status;
            }
        }

        if (newStatus) {
            const project = projects.find((p) => p.id === projectId);
            if (project && project.status !== newStatus) {
                onStatusChange(projectId, newStatus);
            }
        }
    };

    const activeProject = activeId
        ? projects.find((p) => p.id === activeId)
        : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusOrder.map((status) => {
                    const config = statusConfig[status];
                    const statusProjects = projectsByStatus[status];

                    return (
                        <KanbanColumn
                            key={status}
                            id={status}
                            title={config.label}
                            projects={statusProjects}
                        >
                            <div className="space-y-3">
                                {statusProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                        onStatusChange={onStatusChange}
                                        statusOptions={statusOrder.map((statusValue) => ({
                                            value: statusValue,
                                            label: statusConfig[statusValue].label,
                                        }))}
                                    />
                                ))}
                            </div>
                        </KanbanColumn>
                    );
                })}
            </div>

            <DragOverlay
                style={{
                    cursor: 'grabbing',
                }}
                dropAnimation={{
                    duration: 150,
                    easing: 'ease-out',
                }}
            >
                {activeProject ? (
                    <ProjectCard
                        project={activeProject}
                        onDelete={() => { }}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

