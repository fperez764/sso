import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet"/>
      </Head>
      <body className='transition-all duration-700 bg-gray-100 font-body dark:bg-zinc-900' style={{ backgroundColor: '#DAE0E6' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}