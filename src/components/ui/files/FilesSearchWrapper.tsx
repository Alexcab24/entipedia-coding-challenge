'use client';

import { useState } from 'react';
import SearchBar from '../SearchBar';
import FilesView from './FilesView';
import { File } from '@/lib/actions/files/get-files';

interface FilesSearchWrapperProps {
    files: File[];
    placeholder?: string;
}

export default function FilesSearchWrapper({
    files,
    placeholder = 'Buscar archivos...',
}: FilesSearchWrapperProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            <div className="w-full sm:w-auto">
                <SearchBar
                    mode="controlled"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={placeholder}
                />
            </div>
            <FilesView files={files} searchQuery={searchQuery} />
        </>
    );
}
