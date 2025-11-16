export interface AcceptInvitationResult {
    success: boolean;
    message: string;
    workspaceId?: string;
    workspaceName?: string;
    requiresAuth?: boolean;
    requiresRegistration?: boolean;
}


export interface PendingInvitation {
    id: string;
    email: string;
    status: 'pending' | 'accepted' | 'expired' | 'cancelled';
    createdAt: Date;
    expiresAt: Date;
    inviterName: string | null;
}

export interface CancelInvitationResult {
    success: boolean;
    message: string;
}

export interface ResendInvitationResult {
    success: boolean;
    message: string;
}

export interface AcceptInvitationPageProps {
    searchParams: Promise<{
        token?: string;
    }>;
}