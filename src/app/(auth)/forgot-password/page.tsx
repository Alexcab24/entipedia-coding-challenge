import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border/50 rounded-2xl shadow-2xl p-6 lg:p-10 backdrop-blur-sm">
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
}

