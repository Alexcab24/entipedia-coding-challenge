'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, LogOut, User } from 'lucide-react';
import Button from '../Button';
import { logout } from '@/lib/actions/auth/logout';

interface HeaderProps {
    workspaceName: string;
    userName?: string;
}

export default function Header({ workspaceName, userName }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-3 lg:gap-4">
                    <Link
                        href="/workspaces"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                    >
                        <Image
                            src="/images/EntipediaLogoBlack.png"
                            alt="Entipedia Logo"
                            width={120}
                            height={48}
                            className="h-8 w-auto transition-all duration-300"
                            priority
                        />
                    </Link>
                    <div className="hidden lg:flex items-center gap-2 text-muted-foreground">
                        <span className="text-muted-foreground/60">/</span>
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary/50 transition-colors">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">{workspaceName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                    {userName && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-secondary transition-colors text-sm border border-border/50">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{userName}</span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Cerrar sesión</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}

