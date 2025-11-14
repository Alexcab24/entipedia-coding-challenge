'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from "use-debounce";


interface ClientsSearchBarProps {
    placeholder?: string;
    className?: string;
}

export default function ClientsSearchBar({
    placeholder = 'Buscar...',
    className,
}: ClientsSearchBarProps) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const searchQuery = searchParams.get('query')?.toString() || '';

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        params.delete('page');
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    function handleClear() {
        handleSearch('');
        const params = new URLSearchParams(searchParams);
        params.delete('query');
        params.delete('page');
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className={cn('relative w-full', className)}>
            <div className="relative group">

                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 group-focus-within:text-primary transition-colors duration-200">
                    <Search className="h-5 w-5" />
                </div>


                <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                    placeholder={placeholder}
                    className="w-full h-14 pl-14 pr-14 rounded-2xl border-2 border-border/40 bg-background/50 backdrop-blur-sm text-base font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-primary/10 transition-all duration-200 shadow-sm hover:shadow-md hover:border-border/60"
                />


                {searchQuery && (
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

