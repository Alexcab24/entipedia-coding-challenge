'use client';

import Loader from './Loader';

export default function PageLoader() {
    return (
        <Loader
            size="lg"
            text="Cargando página..."
            fullScreen
        />
    );
}

