'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

import Link from 'next/link';

export function CTASection() {
  return (
    <section className='relative mx-auto max-w-7xl px-6 py-20 pb-32 sm:px-8 sm:py-28 sm:pb-40 lg:px-12'>
      <div className='mx-auto max-w-2xl text-center'>
        <h2 className='font-bold text-2xl text-white tracking-tight sm:text-3xl lg:text-4xl'>
          Ready to supercharge your Minecraft server?
        </h2>

        <p className='mx-auto mt-5 max-w-xl text-base text-neutral-300 leading-relaxed sm:text-lg'>
          Join hundreds of servers already using CanvasMC to deliver exceptional performance to their players.
        </p>

        <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button asChild className='w-full sm:size-lg sm:w-auto'>
            <Link href='/downloads' className='inline-flex items-center gap-2'>
              Get Started
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>

          <Button asChild variant='secondary' className='w-full sm:size-lg sm:w-auto'>
            <a
              href='https://docs.canvasmc.io'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2'
            >
              Read Documentation
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
