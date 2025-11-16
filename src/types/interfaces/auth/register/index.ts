export interface VerifyEmailPageProps {
    searchParams: Promise<{
      email?: string;
      status?: 'expired' | 'invalid' | 'error';
      token?: string;
      invitation?: string;
    }>;
  }


export interface RegisterFormProps {
    onSwitchToLogin?: () => void;
    invitationToken?: string;
  }
  