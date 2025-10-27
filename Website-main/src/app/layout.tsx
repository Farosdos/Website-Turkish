import type { Metadata, Viewport } from 'next';
import { Footer } from '~/components/footer';
import { Navbar } from '~/components/navbar';
import { siteConfig } from '~/config/site';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['CanvasMC', 'Canvas', 'Regionizing', 'Threaded Minecraft', 'Folia', 'Performance', 'Multithreading'],
  openGraph: {
    url: new URL(siteConfig.url),
    siteName: siteConfig.name,
    images: [
      {
        url: '/og.png',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className="relative bg-background min-h-screen font-sans antialiased text-foreground">
        <Navbar />
        <div
          style={{
            transform: 'scale(1.3)',
            transformOrigin: 'top left',
            width: 'calc(100% / 1.3)',
            minHeight: 'calc(100vh / 1.3)',
          }}
        >
          <main className="mt-15">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
