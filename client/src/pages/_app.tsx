import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import axios from 'axios';
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
//import {disableReactDevTools} from '@fvilers/siable-react-devtools';
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

//if(process.env.NODE_ENV === 'production') disableReactDevTools();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const { pathname } = useRouter();
    const authRoutes = ['/register', '/login'];
    const authRoute = authRoutes.includes(pathname);
    return (
        <AuthProvider>
            <Toaster />
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
