export interface UploadFileState {
    status: 'success' | 'error';
    message?: string;
    fieldErrors?: {
        name?: string;
        type?: string;
        file?: string;
        url?: string;
        description?: string;
    };
}

export const uploadFileInitialState: UploadFileState = {
    status: 'error',
    message: '',
    fieldErrors: {},
};
