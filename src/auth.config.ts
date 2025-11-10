import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { usersTable } from './lib/db/schema';
import { db } from './lib/db';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

export const authConfig: NextAuthConfig = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/',
        newUser: '/',
        signOut: '/logout',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    providers: [

        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;

                //Buscar correo en la base de datos
                const user = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1).then((rows) => rows[0]);

                if (!user) return null;

                //Verificar contraseña
                if (!bcryptjs.compareSync(password, user.password)) {
                    throw new Error('Invalid credentials');
                }

                if (!user.emailVerifiedAt) {
                    throw new Error('Email not verified');
                }

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _, ...rest } = user;
                return rest;
            },
        }),

    ]
};


export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);