export type ForgotPasswordState = {
    status: 'idle' | 'success' | 'error';
    message?: string;
};

export const forgotPasswordInitialState: ForgotPasswordState = {
    status: 'idle',
};

