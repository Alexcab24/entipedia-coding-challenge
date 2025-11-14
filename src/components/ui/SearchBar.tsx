'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
    mode?: 'url' | 'controlled';
    value?: string;
    onChange?: (value: string) => void;
}

export default function SearchBar({
    placeholder = 'Buscar...',
    className,
    mode = 'url',
    value: controlledValue,
    onChange: controlledOnChange,
}: SearchBarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const urlQuery = searchParams.get('query')?.toString() || '';
    const displayValue = mode === 'url' ? urlQuery : (controlledValue || '');

    const handleSearch = useDebouncedCallback((term: string) => {
        if (mode === 'url') {
            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set('query', term);
            } else {
                params.delete('query');
            }
            params.delete('page');
            router.replace(`${pathname}?${params.toString()}`);
        } else if (controlledOnChange) {
            controlledOnChange(term);
        }
    }, 300);

    const handleClear = () => {
        if (mode === 'url') {
            const params = new URLSearchParams(searchParams);
            params.delete('query');
            params.delete('page');
            router.replace(`${pathname}?${params.toString()}`);
        } else if (controlledOnChange) {
            controlledOnChange('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (mode === 'url') {
            handleSearch(newValue);
        } else if (controlledOnChange) {
            controlledOnChange(newValue);
        }
    };

    return (
        <div className={cn('relative w-full', className)}>
            <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 group-focus-within:text-primary transition-colors duration-200">
                    <Search className="h-5 w-5" />
                </div>

                <input
                    type="text"
                    value={mode === 'url' ? undefined : displayValue}
                    defaultValue={mode === 'url' ? urlQuery : undefined}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full h-14 pl-14 pr-14 rounded-2xl border-2 border-border/40 bg-background/50 backdrop-blur-sm text-base font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-primary/10 transition-all duration-200 shadow-sm hover:shadow-md hover:border-border/60"
                />

                {displayValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 p-2 rounded-xl hover:bg-muted/50 active:scale-95 group/clear"
                        aria-label="Limpiar búsqueda"
                        type="button"
                    >
                        <X className="h-4 w-4 group-hover/clear:rotate-90 transition-transform duration-200" />
                    </button>
                )}

                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        </div>
    );
}

