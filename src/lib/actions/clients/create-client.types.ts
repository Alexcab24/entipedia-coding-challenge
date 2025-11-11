export interface CreateClientState {
    status: 'success' | 'error';
    message?: string;
    fieldErrors?: {
        name?: string;
        type?: string;
        email?: string;
        phone?: string;
        value?: string;
        dateFrom?: string;
        dateTo?: string;
        notes?: string;
    };
}

export const createClientInitialState: CreateClientState = {
    status: 'error',
    message: '',
    fieldErrors: {},
};

