'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
    fullScreen?: boolean;
}

export default function Loader({
    size = 'md',
    className,
    text,
    fullScreen = false
}: LoaderProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    const containerClasses = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
        : 'flex items-center justify-center';

    return (
        <div className={cn(containerClasses, className)}>
            <div className="flex flex-col items-center gap-3">
                <Loader2
                    className={cn(
                        'animate-spin text-primary',
                        sizeClasses[size]
                    )}
                />
                {text && (
                    <p className="text-sm text-muted-foreground font-medium">
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}

