'use client';

import { Building2, ChevronRight } from 'lucide-react';
import type { Workspace } from '@/lib/actions/workspaces/get-workspaces';

interface WorkspacesListProps {
    workspaces: Workspace[];
    onSelectWorkspace: (workspaceId: string) => void;
    title: string;
    emptyMessage?: string;
    showRole?: boolean;
    roleLabel?: string;
}

export default function WorkspacesList({
    workspaces,
    onSelectWorkspace,
    title,
    emptyMessage,
    showRole = false,
    roleLabel,
}: WorkspacesListProps) {
    if (workspaces.length === 0 && emptyMessage) {
        return null;
    }

    return (
        <div className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {workspaces.map((workspace) => (
                    <button
                        key={workspace.id}
                        onClick={() => onSelectWorkspace(workspace.id)}
                        className="group cursor-pointer relative bg-card border-2 border-border rounded-xl p-4 sm:p-6 hover:border-primary hover:shadow-lg transition-all duration-200 text-left w-full"
                    >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>

                        </div>
                        <div className="mb-2 sm:mb-3 flex items-center justify-between">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {workspace.name}
                            </h3>
                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        {workspace.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {workspace.description}
                            </p>
                        )}
                        {showRole && roleLabel && (
                            <span className="absolute top-3 sm:top-4 right-3 sm:right-4 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                {roleLabel}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

