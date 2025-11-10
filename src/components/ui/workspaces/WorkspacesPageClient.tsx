'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, LogOut, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { logout } from '@/lib/actions/auth/logout';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import WorkspacesHeader from './WorkspacesHeader';
import WorkspacesList from './WorkspacesList';
import type { Workspace } from '@/lib/actions/workspaces/get-workspaces';

interface WorkspacesPageClientProps {
    workspaces: Workspace[];
}

export default function WorkspacesPageClient({ workspaces }: WorkspacesPageClientProps) {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleSelectWorkspace = (workspaceId: string) => {
        console.log('workspaceId', workspaceId);
        const workspace = workspaces.find((w) => w.id === workspaceId);
        if (workspace) {
            router.push(`/${workspace.workspace}/dashboard`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const ownWorkspaces = workspaces.filter((w) => w.role === 'owner');

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                            <Image
                                src="/images/EntipediaLogoBlack.png"
                                alt="Entipedia Logo"
                                width={200}
                                height={80}
                                className="h-6 sm:h-8 lg:h-10 w-auto"
                                priority
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-500 hover:bg-primary hover:text-primary-foreground shrink-0"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="max-w-6xl mx-auto">
                        <WorkspacesHeader onOpenCreateModal={() => setShowCreateModal(true)} />

                        {/* Own Workspaces */}
                        <WorkspacesList
                            workspaces={ownWorkspaces}
                            onSelectWorkspace={handleSelectWorkspace}
                            title="Mis empresas"
                            showRole={true}
                            roleLabel="Propietario"
                        />

                        {/* Empty State */}
                        {workspaces.length === 0 && (
                            <div className="text-center py-8 sm:py-12">
                                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                                    No tienes espacios de trabajo
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                                    Crea tu primera empresa para comenzar
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Crear empresa
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Company Modal */}
            <CreateWorkspaceModal
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
            />
        </div>
    );
}
