'use client';

import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/actions/projects/get-projects';
import { CheckCircle2, Circle, XCircle, PauseCircle } from 'lucide-react';

interface KanbanColumnProps {
    id: string;
    title: string;
    projects: Project[];
    children: React.ReactNode;
}

const statusIcons: Record<string, React.ReactNode> = {
    active: <Circle className="h-4 w-4" />,
    inactive: <PauseCircle className="h-4 w-4" />,
    completed: <CheckCircle2 className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />,
};

export default function KanbanColumn({
    id,
    title,
    projects,
    children,
}: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    const icon = statusIcons[id] || <Circle className="h-4 w-4" />;

    return (
        <div
            className={cn(
                "flex flex-col h-full min-h-[600px] bg-card rounded-xl border border-border/60 shadow-md overflow-hidden",
                isOver && "ring-2 ring-primary/50 ring-offset-1"
            )}
        >
            <div className="bg-primary/50 backdrop-blur-md border-b-2 border-primary/30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                        {icon}
                    </div>
                    <h3 className="text-sm font-bold text-primary-foreground tracking-tight">
                        {title}
                    </h3>
                </div>
                <span className="text-xs font-semibold text-primary-foreground bg-primary-foreground/20 px-2.5 py-1 rounded-full min-w-[24px] text-center">
                    {projects.length}
                </span>
            </div>
            <div
                ref={setNodeRef}
                className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-background/50 p-3"
            >
                {projects.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-12 h-full flex items-center justify-center">
                        <span className="text-base font-medium">No hay proyectos</span>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}

