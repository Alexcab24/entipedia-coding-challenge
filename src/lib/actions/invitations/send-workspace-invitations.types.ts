export interface SendInvitationsState {
    status: 'success' | 'error';
    message: string;
    sentCount?: number;
    failedEmails?: string[];
}

export const sendInvitationsInitialState: SendInvitationsState = {
    status: 'success',
    message: '',
};

