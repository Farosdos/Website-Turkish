import Footer from '~/components/footer';
import Navbar from '~/components/navbar';

import { Geist } from 'next/font/google';

import './globals.css';

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geist.variable} antialiased`}>
        <Navbar />
        <div className='h-[4.5rem]' aria-hidden='true' />
        {children}
        <Footer />
      </body>
    </html>
  );
}
