import type { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import { Footer } from '~/components/footer';
import { Navbar } from '~/components/navbar';
import { plausibleConfig } from '~/config/plausible';
import { siteConfig } from '~/config/site';
import { geist, geistMono } from '~/lib/fonts';
import { cn } from '~/lib/utils';
import '~/styles/globals.css';

export const viewport: Viewport = {
  themeColor: '#44b5b4',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['CanvasMC', 'PaperMC', 'Purpur', 'Performance', 'Multithreading'],
  openGraph: {
    url: new URL(siteConfig.url),
    siteName: siteConfig.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
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
      <PlausibleProvider {...plausibleConfig}>
        <body
          className={cn(
            geist.variable,
            geistMono.variable,
            'antialiased',
            'bg-background font-sans text-foreground',
            'min-h-screen supports-[height:100dvh]:min-h-dvh',
            'selection:bg-neutral-700/50 selection:text-neutral-100',
          )}
        >
          <Navbar />
          <main className='mt-15'>{children}</main>
          <Footer />
        </body>
      </PlausibleProvider>
    </html>
  );
}
