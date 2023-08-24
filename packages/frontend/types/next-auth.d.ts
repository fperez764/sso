import NextAuth from 'next-auth';
import { SVGProps } from 'react';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
        };
    }
}
