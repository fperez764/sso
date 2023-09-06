import '@styles/global2.css';
import '@styles/globals.css';
import { AuthProvider } from '@src/context/auth';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@src/components/menues/Sidebar';

const RootLayout = ({ children }: any) => (
  <html lang='es'>
    <body className=''>
      <AuthProvider>
        <Toaster position='bottom-center'/>
        <main className=''>
				{/*<Sidebar />*/}
        {children}
        </main>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
