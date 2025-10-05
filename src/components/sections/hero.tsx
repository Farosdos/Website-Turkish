'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/utils';

export function Hero() {

  return (
    <section className='relative isolate'>
      <div className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-32'>
        <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-16'>
          <div className='max-w-xl'>
            <h1 className="font-bold text-4xl leading-tight lg:text-5xl bg-gradient-to-r from-white via-neutral-300 to-white bg-clip-text text-transparent">
              High performance Minecraft server software
            </h1>
            <p className="mt-7 text-2xl bg-gradient-to-r from-neutral-100 via-neutral-400 to-neutral-100 bg-clip-text text-transparent">
              CanvasMC is a fork of the Folia Minecraft server software that fixes gameplay inconsistencies, bugs, and introduces further performance enhancements to the dedicated server
            </p>
            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <Button asChild size='lg' className='gap-2 transform transition-transform duration-200 hover:scale-105'>
                <Link href='/downloads'>Download Canvas</Link>
              </Button>
              <Button asChild variant='secondary' size='lg'>
                <a
                  href='https://docs.canvasmc.io'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 transform transition-transform duration-200 hover:scale-105'
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
               width={460}
               height={460}/>
          </div>
        </div>
      </div>
    </section>
  );
}
