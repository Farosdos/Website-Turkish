import { Metadata, Viewport } from 'next';
import { Footer } from '~/components/footer';
import { Navbar } from '~/components/navbar';
import { cn } from '~/lib/utils';

import { Geist } from 'next/font/google';

import './globals.css';

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#44b5b4',
};

export const metadata: Metadata = {
  title: {
    default: 'CanvasMC',
    template: '%s | CanvasMC',
  },
  description:
    'Powerful fork of PurpurMC that introduces experimental yet effective performance optimizations, featuring multithreaded dimension ticking, optimized chunk generation and many more! Built to soar.',
  openGraph: {
    url: 'https://canvasmc.io',
    siteName: 'CanvasMC',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CanvasMC Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@thedueris',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body
        className={cn(
          geist.variable,
          'antialiased',
          'bg-background text-foreground font-sans',
          'min-h-screen supports-[height:100dvh]:min-h-dvh',
        )}
      >
        <Navbar />
        <main role='main' className='mt-15'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
