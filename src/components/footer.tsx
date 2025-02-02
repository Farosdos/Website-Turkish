'use client';

import { Heart } from 'lucide-react';
import { siteConfig } from '~/siteconfig';

import Image from 'next/image';
import Link from 'next/link';

interface LinkItem {
  href: string;
  label: string;
}

interface SocialItem {
  href: string;
  Icon: React.ComponentType<{ className: string }>;
  label: string;
}

interface LinkColumnProps {
  title: string;
  links: LinkItem[];
}

const LINK_SECTIONS: { title: string; links: LinkItem[] }[] = [
  {
    title: 'Getting Started',
    links: [
      { href: '/downloads', label: 'Downloads' },
      { href: 'https://docs.canvasmc.io', label: 'Documentation' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: siteConfig.links.discord, label: 'Discord' },
      { href: siteConfig.links.github.org, label: 'GitHub' },
      { href: `${siteConfig.links.github.repo}/issues`, label: 'Issues' },
    ],
  },
  {
    title: 'CanvasMC',
    links: [
      { href: '/team', label: 'Team' },
      { href: `${siteConfig.links.github.repo}/blob/master/LICENSE`, label: 'License' },
      { href: siteConfig.links.jenkins, label: 'Jenkins' },
      { href: siteConfig.links.donate, label: 'Donate' },
    ],
  },
];

const SOCIALS: SocialItem[] = [
  {
    href: siteConfig.links.github.org,
    label: 'GitHub',
    Icon: ({ className }: { className: string }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor' aria-hidden='true' role='img'>
        <title>GitHub</title>
        <path d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' />
      </svg>
    ),
  },
  {
    href: siteConfig.links.discord,
    label: 'Discord',
    Icon: ({ className }: { className: string }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor' aria-hidden='true' role='img'>
        <title>Discord</title>
        <path d='M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z' />
      </svg>
    ),
  },
];

function LinkColumn({ title, links }: LinkColumnProps) {
  return (
    <section className='space-y-3'>
      <h3 className='text-sm font-medium'>{title}</h3>
      <ul role='list' className='space-y-1.5'>
        {links.map(({ href, label }) => {
          const isExternal = href.startsWith('http');
          return (
            <li key={href} role='listitem'>
              {isExternal ? (
                <a
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-neutral-400 transition-colors duration-200 hover:text-white'
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className='text-sm text-neutral-400 transition-colors duration-200 hover:text-white'>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-background/50 border-t border-neutral-800/80 backdrop-blur-xl'>
      <div className='container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
        <div className='grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5'>
          <section className='text-left lg:col-span-2'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 rounded-xl transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none'
            >
              <Image src='/logo.png' alt='' width={28} height={28} className='rounded-xl' />
              <div>
                <h2 className='text-base font-semibold'>CanvasMC</h2>
              </div>
            </Link>

            <p className='mt-1 text-sm text-neutral-400'>
              Powerful fork of PurpurMC that introduces experimental yet effective performance optimizations, featuring
              multithreaded dimension ticking and improved chunk generation.
            </p>

            <div className='mt-6 flex gap-4'>
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`${label} (opens in new tab)`}
                  className='text-neutral-300 transition-colors hover:text-neutral-100'
                >
                  <Icon className='h-4.5 w-4.5' />
                </a>
              ))}
            </div>
          </section>

          <div className='grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3'>
            {LINK_SECTIONS.map((section) => (
              <LinkColumn key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>

        <div className='mt-8 flex flex-col items-start justify-between gap-4 border-t border-neutral-800/80 pt-8 text-sm sm:flex-row sm:items-center'>
          <p className='text-neutral-400'>
            &copy; {currentYear} CanvasMC. Not affiliated with Mojang Studios or Microsoft.
          </p>
          <div className='flex items-center gap-1 text-neutral-400'>
            <span>Built with</span>
            <Heart className='h-3 w-3' fill='currentColor' />
            <span>by the</span>
            <Link
              href='/team'
              className='rounded text-neutral-400 underline underline-offset-2 transition-colors duration-200 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none'
            >
              CanvasMC Team
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
