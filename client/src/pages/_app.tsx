import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import axios from 'axios';
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
axios.defaults.baseURL = 'http://localhost:5001/api';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const { pathname } = useRouter();
    const authRoutes = ['/register', '/login'];
    const authRoute = authRoutes.includes(pathname);
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
