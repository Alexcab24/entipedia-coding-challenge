'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { usersTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function verifyEmail(token: string, invitationToken?: string) {
    if (!token) {
        redirect('/verify-email?status=invalid');
    }

    try {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.verificationToken, token))
            .limit(1);

        if (!user) {
            redirect('/verify-email?status=invalid');
        }

        if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
            redirect('/verify-email?status=expired');
        }

        await db
            .update(usersTable)
            .set({
                emailVerifiedAt: new Date(),
                verificationToken: null,
                verificationTokenExpiresAt: null,
            })
            .where(eq(usersTable.id, user.id));

        const successUrl = invitationToken
            ? `/verify-email/success?email=${encodeURIComponent(user.email)}&invitation=${encodeURIComponent(invitationToken)}`
            : `/verify-email/success?email=${encodeURIComponent(user.email)}`;
        redirect(successUrl);
    } catch (error) {
        if (error && typeof error === 'object' && 'digest' in error &&
            typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('Failed to verify email:', error);
        redirect('/verify-email?status=error');
    }
}

