export type ResetPasswordState = {
    status: 'idle' | 'error';
    message?: string;
    fieldErrors?: Partial<Record<'password' | 'confirmPassword', string>>;
};

export const resetPasswordInitialState: ResetPasswordState = {
    status: 'idle',
};

