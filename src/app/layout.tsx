import { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import { Footer } from '~/components/footer';
import { Navbar } from '~/components/navbar';
import { siteConfig } from '~/config/site';
import { geist } from '~/lib/fonts';
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
  description:
    'Powerful fork of PurpurMC that introduces experimental yet effective performance optimizations, featuring multithreaded dimension ticking, optimized chunk generation and many more! Built to soar.',
  openGraph: {
    url: siteConfig.url,
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
      <PlausibleProvider domain={new URL(siteConfig.url).hostname} trackFileDownloads trackOutboundLinks>
        <body
          className={cn(
            geist.variable,
            'antialiased',
            'bg-background text-foreground font-sans',
            'min-h-screen supports-[height:100dvh]:min-h-dvh',
            'selection:bg-neutral-700/50 selection:text-neutral-100',
          )}
        >
          <Navbar />
          <main role='main' className='mt-15'>
            {children}
          </main>
          <Footer />
        </body>
      </PlausibleProvider>
    </html>
  );
}
