export type CreateWorkspaceState = {
    status: 'idle' | 'error';
    message?: string;
    fieldErrors?: Partial<Record<'name' | 'email' | 'phone' | 'description' | 'workspace', string>>;
};

export const createWorkspaceInitialState: CreateWorkspaceState = {
    status: 'idle',
};

