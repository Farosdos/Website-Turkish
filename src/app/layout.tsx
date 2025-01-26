import Footer from '~/components/footer';
import Navbar from '~/components/navbar';
import { cn } from '~/lib/utils';

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
      <body className={cn(geist.variable, 'antialiased')}>
        <Navbar />
        <div className='h-15' aria-hidden='true' />
        {children}
        <Footer />
      </body>
    </html>
  );
}
