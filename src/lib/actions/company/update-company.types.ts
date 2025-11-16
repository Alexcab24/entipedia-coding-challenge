export interface UpdateCompanyState {
    status: 'success' | 'error';
    message?: string;
}

export const updateCompanyInitialState: UpdateCompanyState = {
    status: 'error',
    message: '',
};