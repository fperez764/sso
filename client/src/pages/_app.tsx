import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const {pathname} = useRouter();
    const authRoutes = ['/register', '/login'];
    const authRoute = authRoutes.includes(pathname);
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
