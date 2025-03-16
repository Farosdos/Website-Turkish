'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { GradientBackground } from '~/components/ui/gradient-background';
import { cn } from '~/lib/utils';

const SOFTWARE_OPTIONS = [
  { id: 'paper', image: '/purpur-logo.png', name: 'Purpur' },
  { id: 'canvas', image: '/logo.png', name: 'Canvas' },
] as const;

export function Hero() {
  const [selected, setSelected] = useState<'paper' | 'canvas'>('canvas');

  const getChange = (paper: number, canvas: number, inverted = false) => {
    const diff = ((inverted ? paper - canvas : canvas - paper) / paper) * 100;
    return Math.round(selected === 'paper' ? -diff : diff);
  };

  return (
    <section className='relative isolate'>
      <GradientBackground />
      <div className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-32'>
        <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-16'>
          <div className='max-w-xl'>
            <h1 className='font-bold text-4xl text-white leading-tight lg:text-5xl'>
              High-performance Minecraft server software
            </h1>
            <p className='mt-6 text-lg text-neutral-300'>
              Supercharge your Minecraft server with multithreaded dimension ticking, improved chunk generation,
              optimized entity handling and many more powerful optimizations.
            </p>
            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <Button asChild size='lg'>
                <Link href='/downloads'>Download Canvas</Link>
              </Button>
              <Button asChild variant='secondary' size='lg'>
                <a
                  href='https://docs.canvasmc.io'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2'
                >
                  Documentation
                  <ArrowRight className='size-4' />
                </a>
              </Button>
            </div>
          </div>
          <div className='flex justify-center'>
            <Image src='/logo_big.png'
               alt='Canvas Logo Blur'
               width={450}
               height={450}
               className='rounded-lg shadow-lg'/>
          </div>
        </div>
      </div>
    </section>
  );
}
