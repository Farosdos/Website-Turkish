'use client';

import { Github, Globe, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type LinkItem = {
  href: string;
  label: string;
};

type SocialItem = {
  href: string;
  Icon: React.ComponentType<{ className: string }>;
  label: string;
};

const LINK_SECTIONS: { title: string; links: LinkItem[] }[] = [
  {
    title: 'Getting Started',
    links: [
      { href: '/docs', label: 'Documentation' },
      { href: '/downloads', label: 'Downloads' },
      { href: '/javadocs', label: 'Javadocs' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: 'https://github.com/CanvasMC', label: 'GitHub' },
      { href: 'https://discord.gg/canvasmc', label: 'Discord' },
      { href: 'https://x.com/CanvasMC', label: 'X (Twitter)' },
    ],
  },
  {
    title: 'CanvasMC',
    links: [
      { href: '/team', label: 'Meet the team' },
      { href: '/contribute', label: 'Contribute' },
      { href: '/sponsors', label: 'Sponsors' },
    ],
  },
];

const SOCIALS: SocialItem[] = [
  { href: 'https://github.com/CanvasMC', Icon: Github, label: 'GitHub' },
  { href: 'https://x.com/CanvasMC', Icon: Twitter, label: 'X (Twitter)' },
  { href: 'mailto:contact@canvasmc.io', Icon: Mail, label: 'Email' },
  { href: 'https://canvasmc.io', Icon: Globe, label: 'Website' },
];

const LinkColumn: React.FC<{ title: string; links: LinkItem[] }> = ({ title, links }) => (
  <section className="space-y-4">
    <h3 className="text-lg font-medium sm:text-base">{title}</h3>
    <ul role="list" className="mt-6 space-y-4 sm:mt-4 sm:space-y-3">
      {links.map(({ href, label }) => {
        const isExternal = href.startsWith('http');
        return (
          <li key={href} role="listitem">
            {isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ) : (
              <Link href={href} className="text-neutral-400 hover:text-white transition-colors duration-200">
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  </section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-neutral-800/80 bg-background/50 backdrop-blur-xl">
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-5">
        {/* Branding Section */}
        <section className="lg:col-span-2 text-center sm:text-left">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-xl"
          >
            <Image
              src="/icon.png"
              alt=""
              width={40}
              height={40}
              className="rounded-xl"
            />
            <div>
              <h2 className="text-lg font-semibold">CanvasMC</h2>
              <p className="text-sm text-neutral-400">High-performance Minecraft server</p>
            </div>
          </Link>

          <p className="mt-6 text-sm text-neutral-400">
            Powerful fork of PurpurMC that introduces experimental yet effective performance optimizations, featuring
            multithreaded dimension ticking and improved chunk generation.
          </p>

          <div className="mt-8 flex justify-center sm:justify-start gap-4">
            {SOCIALS.map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        {/* Links Sections */}
        <div className="lg:col-span-3 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {LINK_SECTIONS.map((section) => (
            <LinkColumn key={section.title} {...section} />
          ))}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-neutral-400">&copy; {new Date().getFullYear()} CanvasMC</p>
        <div className="flex items-center gap-2">
          Made with <span role="img" aria-label="love">❤️</span> by the{' '}
          <Link 
            href="/contributors" 
            className="text-white underline underline-offset-2 hover:text-neutral-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded"
          >
            CanvasMC Team
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;