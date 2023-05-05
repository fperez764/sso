import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import axios from 'axios';
import { AuthProvider } from '../context/auth';
import { Toaster } from 'react-hot-toast';
//import {disableReactDevTools} from '@fvilers/siable-react-devtools';
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;
console.warn('env: '+serverURL);
axios.defaults.baseURL = serverURL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 60000;

//if(process.env.NODE_ENV === 'production') disableReactDevTools();


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <AuthProvider>
            <Toaster position='bottom-center'/>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
