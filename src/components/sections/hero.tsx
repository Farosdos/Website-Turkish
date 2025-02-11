'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { GradientBackground } from '~/components/ui/gradient-background';
import { cn } from '~/lib/utils';

const METRICS = [
  { label: 'Startup Time', paper: 17.5, canvas: 15.8, unit: 's', inverted: true },
  { label: 'Chunk Generation', paper: 130, canvas: 220, unit: 'cps', inverted: false },
  { label: 'Hopper Tick', paper: 60, canvas: 32, unit: 'ms', inverted: true },
  { label: 'Villager Tick', paper: 310, canvas: 165, unit: 's', inverted: true },
] as const;

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
                  <ArrowRight className='h-4 w-4' />
                </a>
              </Button>
            </div>
          </div>

          <div className='relative space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {SOFTWARE_OPTIONS.map(({ id, image, name }) => (
                <Card
                  key={id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 p-4 transition-all duration-200',
                    selected === id ? 'ring-neutral-600' : 'hover:ring-neutral-600/60',
                  )}
                  onClick={() => setSelected(id as typeof selected)}
                >
                  <Image src={image} alt={name} width={40} height={40} />
                  <span
                    className={cn(
                      'font-medium text-sm transition-colors duration-200',
                      selected === id ? 'text-neutral-100' : 'text-neutral-400',
                    )}
                  >
                    {name}
                  </span>
                </Card>
              ))}
            </div>

            <div className='relative py-2'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-neutral-800 border-t' />
              </div>
              <div className='relative flex justify-center'>
                <span className='rounded-full bg-neutral-800 px-3 text-neutral-400 text-sm'>
                  Performance Comparison
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {METRICS.map(({ label, paper, canvas, unit, inverted }) => {
                const change = getChange(paper, canvas, inverted);

                return (
                  <Card key={label} className='flex flex-col p-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-neutral-400 text-sm'>{label}</span>
                      <span className={cn('font-mono text-sm', change > 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {change > 0 && '+'}
                        {change}%
                      </span>
                    </div>
                    <div className='flex-1' />
                    <div className='flex items-end justify-between font-mono'>
                      <span
                        className={cn(
                          'transition-colors duration-200',
                          selected === 'paper' ? 'text-white' : 'text-neutral-500',
                        )}
                      >
                        {paper}
                        {unit}
                      </span>
                      <span
                        className={cn(
                          'transition-colors duration-200',
                          selected === 'canvas' ? 'text-white' : 'text-neutral-500',
                        )}
                      >
                        {canvas}
                        {unit}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            <p className='mt-4 text-right text-neutral-500 text-xs'>
              The benchmarks shown are tested on: 32 GB - Intel Core i9-14900HX 2.20 GHz - Windows 11, with the
              villagers test run on 16GB - Intel Core i5-6200U - Arch linux
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
