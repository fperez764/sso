import "@styles/globals.css";

import Nav from "@components/trece/Nav";
import Provider from "@components/trece/Provider";

const RootLayout = ({ children }) => (
  <html lang='es'>
    <body>
      <Provider>
        <div className='main'>
          <div className='gradient' />
        </div>

        <main className='app'>
          <Nav />
          {children}
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
