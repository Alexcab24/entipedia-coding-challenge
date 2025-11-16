export interface CreateProjectState {
    status: 'success' | 'error';
    message?: string;
    fieldErrors?: {
        name?: string;
        description?: string;
        status?: string;
        priority?: string;
    };
}



export const createProjectInitialState: CreateProjectState = {
    status: 'error',
        message: '',
        fieldErrors: {},
    };

