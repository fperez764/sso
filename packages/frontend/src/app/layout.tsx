import '@styles/global2.css';
import '@styles/globals.css';
import { AuthProvider } from '@src/context/auth';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@src/components/menues/Sidebar';

const RootLayout = ({ children }: any) => (
  <html lang='es'>
    <body className='min-h-screen'>
      <AuthProvider>
        <Toaster position='bottom-center'/>
        <div className='main'>
          <div className='gradient' />
        </div>
				<Sidebar />
        <main className='app'>
        {children}
        </main>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
