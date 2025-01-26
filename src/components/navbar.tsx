'use client';

import { ExternalLink, Menu, X } from 'lucide-react';
import { cn } from '~/lib/utils';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  icon?: React.ComponentType<{ className: string }>;
};

const LINKS = {
  nav: [
    { href: '/downloads', label: 'Downloads' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/docs', label: 'Docs' },
    { href: 'https://jenkins.canvasmc.io/job/Canvas/', label: 'Jenkins', external: true },
  ],
  social: [
    {
      href: 'https://github.com/CraftCanvasMC',
      label: 'GitHub',
      external: true,
      icon: ({ className }: { className: string }) => (
        <svg viewBox='0 0 24 24' className={className} fill='currentColor' aria-hidden='true' role='img'>
          <title>GitHub</title>
          <path d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' />
        </svg>
      ),
    },
    {
      href: 'https://discord.gg/canvasmc',
      label: 'Discord',
      external: true,
      icon: ({ className }: { className: string }) => (
        <svg viewBox='0 0 24 24' className={className} fill='currentColor' aria-hidden='true' role='img'>
          <title>Discord</title>
          <path d='M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z' />
        </svg>
      ),
    },
  ],
} as const;

function NavbarLink({ href, label, external, icon: Icon, className }: NavLink & { className?: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Comp = external ? 'a' : Link;

  return (
    <Comp
      href={href}
      className={cn(
        'flex items-center gap-1.5 text-sm transition-colors duration-200',
        isActive ? 'text-white' : 'text-neutral-300 hover:text-neutral-100',
        className,
      )}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      {...(external && {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${label} (opens in new tab)`,
      })}
    >
      {Icon ? (
        <Icon className='h-5 w-5' />
      ) : (
        <>
          {label}
          {external && <ExternalLink className='ml-1.5 h-3.5 w-3.5' aria-hidden='true' />}
        </>
      )}
    </Comp>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className='supports-[backdrop-filter]:bg-background/90 fixed top-0 right-0 left-0 z-50 border-b border-neutral-800 text-white backdrop-blur-sm'
      role='navigation'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-15 items-center justify-between'>
          <div className='flex items-center space-x-8'>
            <Link href='/' className='flex items-center space-x-3 hover:opacity-90' aria-label='CanvasMC Home'>
              <Image src='/icon.png' alt='' width={32} height={32} className='rounded-md' priority />
              <span className='text-sm font-semibold'>CanvasMC</span>
            </Link>
            <div className='hidden md:flex md:space-x-4' role='menubar'>
              {LINKS.nav.map((link) => (
                <NavbarLink key={link.href} {...link} />
              ))}
            </div>
          </div>

          <div className='hidden md:flex md:items-center md:space-x-5' role='menubar' aria-label='Social links'>
            {LINKS.social.map((link) => (
              <NavbarLink key={link.href} {...link} />
            ))}
          </div>

          <button
            onClick={() => setIsOpen((p) => !p)}
            className='inline-flex items-center justify-center rounded-md p-2.5 text-neutral-300 transition-colors hover:bg-neutral-800 md:hidden'
            aria-expanded={isOpen}
            aria-controls='mobile-menu'
            aria-label={`${isOpen ? 'Close' : 'Open'} menu`}
          >
            {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id='mobile-menu'
          className='bg-background absolute top-16 right-0 left-0 border-b border-neutral-800 pt-5 md:hidden'
          role='menu'
          aria-label='Mobile navigation'
        >
          <div className='space-y-1 px-2 pb-3'>
            {LINKS.nav.map((link) => (
              <NavbarLink
                key={link.href}
                {...link}
                className='flex items-center rounded-md px-3 py-2 transition-colors hover:bg-neutral-800'
              />
            ))}
            <div className='-mx-4 pt-3 sm:-mx-6 lg:-mx-8'>
              <div className='border-t border-neutral-800'>
                <div className='flex gap-2 px-6 pt-3' role='menu' aria-label='Mobile social links'>
                  {LINKS.social.map((link) => (
                    <NavbarLink
                      key={link.href}
                      {...link}
                      className='rounded-md p-1.5 transition-colors hover:bg-neutral-800'
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
