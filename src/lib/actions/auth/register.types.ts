export type RegisterActionState = {
    status: 'idle' | 'error';
    message?: string | null;
    fieldErrors?: Partial<Record<'fullName' | 'email' | 'password' | 'confirmPassword', string>>;
    values?: Partial<Record<'fullName' | 'email', string>>;
};

export const registerInitialState: RegisterActionState = {
    status: 'idle',
    message: null,
    fieldErrors: {},
    values: {},
};

