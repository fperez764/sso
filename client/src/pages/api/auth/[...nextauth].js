import { PuzzlePieceIcon, SunIcon } from '@heroicons/react/24/outline';
import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        CredentialProvider({
            name: 'credentials',
            credentials: {
                username: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'test@abe.bo',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: (credentials) => {
                if (
                    credentials.username === 'Test' &&
                    credentials.password === 'Test'
                ) {
                    return {
                        id: 2,
                        name: 'Test',
                        email: 'test@abe.bo',
                    };
                }
                //login failed
                return null;
            },
        }),
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            //First time JWT callback is run, user obect is available
            if (user) token.id = user.id;
            return token;
        },
        session: ({ session, token }) => {
            if (session) {
                session.id = token.id;
                //? TODO: Aqui se puede agregar la revision de que permisos tiene cada usuario
                session.user.role =
                    session.user.name === 'Test'
                        ? 'SuperAdmin'
                        : 'SimpleMortal';
            }
            return session;
        },
    },
    secret: 'test',
    jwt: {
        secret: 'test',
        encryption: true,
    },
    pages: {
        //signIn: '/auth/signin',
    },
});
