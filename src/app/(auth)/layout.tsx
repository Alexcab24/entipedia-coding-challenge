import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {

    const session = await auth();
    console.log('session', session?.user);

    if (session?.user) {
        redirect('/workspaces');
    }

    return (
        <div className="min-h-screen bg-background">
                    {children}
        </div>
    )
}

export default AuthLayout