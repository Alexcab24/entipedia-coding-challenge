export interface UpdateProjectFormData {
    status: 'success' | 'error';
    message?: string;
    fieldErrors?: {
        name?: string;
        description?: string;
        status?: string;
        priority?: string;
    };
}



export const updateProjectInitialState: UpdateProjectFormData = {
    status: 'error',
    message: '',
    fieldErrors: {},
};

