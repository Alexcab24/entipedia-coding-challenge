'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    FileText,
    Settings,
    Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    workspace: string;
}

const navigation = [
    {
        name: 'Dashboard',
        href: (workspace: string) => `/${workspace}/dashboard`,
        icon: LayoutDashboard,
    },
    {
        name: 'Proyectos',
        href: (workspace: string) => `/${workspace}/projects`,
        icon: FolderKanban,
    },
    {
        name: 'Clientes',
        href: (workspace: string) => `/${workspace}/clients`,
        icon: Users,
    },
    {
        name: 'Archivos',
        href: (workspace: string) => `/${workspace}/files`,
        icon: FileText,
    },
    {
        name: 'Configuración',
        href: (workspace: string) => `/${workspace}/settings`,
        icon: Settings,
    },
];

export default function Sidebar({ workspace }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:border-r lg:border-border lg:bg-background">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
                <nav className="flex-1 px-3 space-y-1">
                    {navigation.map((item) => {
                        const href = item.href(workspace);
                        const isActive = pathname === href || pathname?.startsWith(`${href}/`);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={href}
                                className={cn(
                                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'mr-3 h-5 w-5 flex-shrink-0',
                                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto px-3 pt-4 border-t border-border">
                    <Link
                        href="/workspaces"
                        className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                        <Building2 className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
                        Cambiar workspace
                    </Link>
                </div>
            </div>
        </aside>
    );
}

