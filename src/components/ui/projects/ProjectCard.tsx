'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Project, ProjectPriority, ProjectStatus } from '@/lib/actions/projects/get-projects';
import { MoreVertical, Calendar, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { formatDateDisplay } from '@/lib/utils/date';

interface ProjectCardProps {
    project: Project;
    onDelete: (project: Project) => void;
    onEdit?: (project: Project) => void;
    onStatusChange?: (projectId: string, status: ProjectStatus) => void;
    statusOptions?: { value: ProjectStatus; label: string }[];
}

const priorityColors: Record<ProjectPriority, string> = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
};

const priorityLabels: Record<ProjectPriority, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
};

const statusLabels: Record<ProjectStatus, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    completed: 'Completado',
    cancelled: 'Cancelado',
};

export default function ProjectCard({
    project,
    onDelete,
    onEdit,
    onStatusChange,
    statusOptions,
}: ProjectCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const availableStatusOptions =
        statusOptions ??
        (Object.keys(statusLabels) as ProjectStatus[]).map((status) => ({
            value: status,
            label: statusLabels[status],
        }));
    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging,
    } = useDraggable({
        id: project.id,
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(project);
        setIsMenuOpen(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(project);
        }
        setIsMenuOpen(false);
    };

    const handleStatusChange = (status: ProjectStatus) => (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStatusChange && status !== project.status) {
            onStatusChange(project.id, status);
        }
        setIsMenuOpen(false);
    };


    const menuOptions: {
        label: string,
        icon: React.ReactNode,
        onClick: (e: React.MouseEvent) => void,
        className?: string
    }[] = [
            {
                label: 'Editar',
                className: 'text-black hover:bg-primary/10 hover:text-foreground/80',
                icon: <Edit className="h-4 w-4" />,
                onClick: handleEdit,
            },
            {
                label: 'Borrar',
                className: 'text-black hover:bg-destructive/10 hover:text-destructive/80',
                icon: <Trash2 className="h-4 w-4" />,
                onClick: handleDelete,
            },
        ];

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                "group bg-linear-to-br from-card via-card/95 to-card/90 border border-border/60 rounded-lg p-4 border-l-4 border-l-transparent hover:border-l-primary hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md overflow-hidden",
                isDragging && "opacity-40"
            )}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-foreground text-sm leading-snug flex-1 line-clamp-2 hover:text-primary transition-colors">
                    {project.name}
                </h3>
                <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <PopoverTrigger asChild>
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className="cursor-pointer shrink-0 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 opacity-50 group-hover:opacity-100 hover:scale-110 active:scale-95"
                            aria-label="Opciones del proyecto"
                            type="button"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-40 p-1 cursor-pointer"
                        align="end"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-1">
                            {menuOptions.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={option.onClick}
                                    className={cn("flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors text-left cursor-pointer", option.className)}
                                >
                                    {option.icon}
                                    <span>{option.label}</span>
                                </button>
                            ))}
                            {onStatusChange && (
                                <div className="mt-1 border-t border-border/60 pt-2">
                                    <p className="px-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Estado
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        {availableStatusOptions.map(({ value, label }) => {
                                            const isActive = project.status === value;
                                            return (
                                                <button
                                                    key={value}
                                                    onClick={handleStatusChange(value)}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors",
                                                        isActive
                                                            ? "bg-primary/10 text-primary font-semibold"
                                                            : "text-muted-foreground hover:bg-muted"
                                                    )}
                                                    disabled={isActive}
                                                >
                                                    <span>{label}</span>
                                                    {isActive && (
                                                        <span className="text-[10px] uppercase tracking-wide">Actual</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {project.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {project.description}
                </p>
            )}

            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-primary/20">
                <div className="flex items-center gap-1.5">
                    <span
                        className={cn(
                            "w-2 h-2 rounded-full",
                            priorityColors[project.priority]
                        )}
                        title={priorityLabels[project.priority]}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                        {priorityLabels[project.priority]}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                        {formatDateDisplay(project.createdAt, {
                            day: '2-digit',
                            month: 'short',
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}

