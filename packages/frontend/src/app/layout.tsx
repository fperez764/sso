import '@styles/global2.css';
import '@styles/globals.css';
import { AuthProvider } from '@src/context/auth';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';
import axios from 'axios';

export const metadata: Metadata = {
  title: "Tickets ABE",
  description: "Tickets Agencia Boliviana Espacial",
};

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;
console.warn('Nextjs uses env: '+serverURL);
axios.defaults.baseURL = serverURL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 12000;

const RootLayout = ({ children }: any) => (
  <html lang='es'>
      <body className='transition-all duration-700 bg-gray-100 font-body dark:bg-zinc-900' style={{ backgroundColor: '#DAE0E6' }}>
        <AuthProvider>
          <Toaster position="top-center" />
          <main>{children}</main>
        </AuthProvider>        
      </body>
  </html>
);

export default RootLayout;
