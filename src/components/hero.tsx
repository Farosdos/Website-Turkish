'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import GradientBackground from '~/components/ui/gradient-background';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className='relative isolate'>
      <GradientBackground />

      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Heavily optimized Minecraft server software
          </h1>

          <p className='mt-6 text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8'>
            Powerful fork of PurpurMC that introduces experimental yet effective performance optimizations, featuring{' '}
            <a href='#' className='text-white underline underline-offset-3'>
              multithreaded dimension ticking
            </a>
            ,{' '}
            <a href='#' className='text-white underline underline-offset-3'>
              improved chunk generation
            </a>
            ,{' '}
            <a href='#' className='text-white underline underline-offset-3'>
              optimized entity handling
            </a>{' '}
            and many more! Built to soar.
          </p>

          <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row'>
            <Button asChild className='w-full sm:w-auto'>
              <Link href='/downloads'>Go to Downloads</Link>
            </Button>
            <Button asChild variant='ghost' className='w-full sm:w-auto'>
              <Link
                href='#features'
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }}
              >
                Learn more
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>

        <div className='mt-16 sm:mt-20'>
          <div className='relative overflow-hidden rounded-xl bg-neutral-800/50 p-2 ring-1 shadow-2xl shadow-neutral-900/50 ring-neutral-700/50 backdrop-blur-sm'>
            <div className='relative aspect-video'>
              <Image
                src='/benchmark.gif'
                alt='Canvas MC Performance Benchmark'
                fill
                className='rounded-lg object-cover'
                priority
              />
              <div className='absolute right-4 bottom-4 left-4 max-w-lg rounded-lg bg-neutral-900/80 p-3 backdrop-blur-sm'>
                <p className='text-sm text-neutral-200'>
                  CanvasMC with 1000 players doing random actions running on Ryzen 9 7950X3D,{' '}
                  <a href='/benchmarks' className='text-white underline underline-offset-2'>
                    checkout other benchmarks
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
