export interface SendWorkspaceInvitationEmailParams {
    email: string;
    workspaceName: string;
    inviterName: string;
    token: string;
}

export interface SendResetPasswordEmailParams {
    email: string;
    name: string;
    token: string;
}
