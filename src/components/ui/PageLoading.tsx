import Loader from './Loader';

interface PageLoadingProps {
    text?: string;
}

export default function PageLoading({ text = 'Cargando...' }: PageLoadingProps) {
    return (
        <div className="w-full flex items-center justify-center min-h-[400px]">
            <Loader size="lg" text={text} />
        </div>
    );
}

