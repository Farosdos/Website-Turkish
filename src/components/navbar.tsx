'use client';

import { ExternalLink, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { jenkinsConfig } from '~/config/jenkins';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/utils';
import { DiscordIcon, GithubIcon } from './icons';

interface NavbarItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const LINKS: NavbarItem[] = [
  { href: '/downloads', label: 'Downloads' },
  { href: '/team', label: 'Team' },
  { href: 'https://docs.canvasmc.io', label: 'Docs' },
  { href: jenkinsConfig.baseUrl, label: 'Jenkins' },
];

const SOCIAL: NavbarItem[] = [
  { href: siteConfig.links.github.org, label: 'GitHub', icon: GithubIcon },
  { href: siteConfig.links.discord, label: 'Discord', icon: DiscordIcon },
];

function NavbarLink({ href, label, icon: Icon, className }: NavbarItem & { className?: string }) {
  const isActive = usePathname() === href;
  const isExternal = href.startsWith('http');

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-1.5 text-sm transition-colors',
        isActive ? 'text-white' : 'text-neutral-300 hover:text-neutral-100',
        className,
      )}
      aria-current={isActive ? 'page' : undefined}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {Icon ? (
        <Icon className='size-5' />
      ) : (
        <>
          {label}
          {isExternal && <ExternalLink className='size-3.5' aria-hidden />}
        </>
      )}
    </Link>
  );
}

function MobileMenu({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <div className='absolute top-15 right-0 left-0 border-neutral-800 border-y bg-background pt-5 md:hidden'>
      <div className='space-y-1 px-2 pb-3'>
        {LINKS.map(link => (
          <NavbarLink key={link.href} {...link} className='rounded-md px-3 py-2 hover:bg-neutral-800' />
        ))}
        <div className='-mx-4 pt-3'>
          <div className='border-neutral-800 border-t'>
            <div className='flex gap-2 px-6 pt-3'>
              {SOCIAL.map(link => (
                <NavbarLink key={link.href} {...link} className='rounded-md p-1.5 hover:bg-neutral-800' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='fixed inset-x-0 top-0 z-50 border-neutral-800 border-b bg-background/90 backdrop-blur-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-15 items-center justify-between'>
          <div className='flex items-center space-x-6'>
            <Link href='/' className='flex items-center space-x-2 hover:opacity-90' aria-label='Home'>
              <Image src='/logo.png' alt='' width={28} height={28} className='rounded-md' priority />
              <span className='font-semibold text-sm'>{siteConfig.name}</span>
            </Link>

            <div className='hidden md:flex md:space-x-4'>
              {LINKS.map(link => (
                <NavbarLink key={link.href} {...link} />
              ))}
            </div>
          </div>

          <div className='hidden md:flex md:items-center md:space-x-5'>
            {SOCIAL.map(link => (
              <NavbarLink key={link.href} {...link} />
            ))}
          </div>

          <button
            type='button'
            onClick={() => setIsOpen(p => !p)}
            className='rounded-md p-2.5 text-neutral-300 hover:bg-neutral-800 md:hidden'
            aria-label={`${isOpen ? 'Close' : 'Open'} menu`}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className='size-6' aria-hidden /> : <Menu className='size-6' aria-hidden />}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} />
    </nav>
  );
}
