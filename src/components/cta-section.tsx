'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

import Link from 'next/link';

export function CTASection() {
  return (
    <section className='relative mx-auto max-w-7xl px-4 py-16 pb-24 sm:px-6 sm:py-24 sm:pb-32 lg:px-8 lg:pb-40'>
      <div className='mx-auto max-w-2xl text-center'>
        <h2 className='text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl'>
          Ready to supercharge your Minecraft server?
        </h2>

        <p className='mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg'>
          Join hundreds of servers already using CanvasMC to deliver exceptional performance to their players.
        </p>

        <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button asChild size='default' className='sm:size-lg w-full sm:w-auto'>
            <Link href='/downloads' className='inline-flex items-center gap-2'>
              Get Started
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>

          <Button asChild variant='secondary' size='default' className='sm:size-lg w-full sm:w-auto'>
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
