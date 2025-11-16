'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    FolderKanban, 
    Users, 
    FileText, 
    Settings,
    Building2,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../Button';

interface MobileSidebarProps {
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

export default function MobileSidebar({ workspace }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 p-0 shadow-lg bg-background border border-border hover:bg-secondary transition-all duration-200"
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
                <div className="relative w-5 h-5">
                    <Menu 
                        className={cn(
                            "absolute inset-0 h-5 w-5 transition-all duration-300",
                            isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                        )} 
                    />
                    <X 
                        className={cn(
                            "absolute inset-0 h-5 w-5 transition-all duration-300",
                            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                        )} 
                    />
                </div>
            </Button>

            {/* Overlay con transición */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
            />

            {/* Sidebar con transición */}
            <aside 
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border lg:hidden transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                aria-hidden={!isOpen}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                        <Link 
                            href="/workspaces" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                        >
                            <Image
                                src="/images/EntipediaLogoBlack.png"
                                alt="Entipedia Logo"
                                width={120}
                                height={48}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0"
                            aria-label="Cerrar menú"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const href = item.href(workspace);
                            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                                            isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-3 pt-4 border-t border-border">
                        <Link
                            href="/workspaces"
                            onClick={() => setIsOpen(false)}
                            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                        >
                            <Building2 className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                            Cambiar workspace
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

