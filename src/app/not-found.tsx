import { ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { GradientBackground } from '~/components/ui/gradient-background';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='relative grid min-h-[calc(100vh-60px)] place-items-center'>
      <GradientBackground />

      <div className='mx-auto w-full max-w-2xl px-6 text-center sm:px-8 lg:px-12'>

        <h1 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>We've lost this page</h1>

        <p className='mt-4 text-base leading-7 text-neutral-300 sm:text-lg'>
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className='mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button asChild size='lg'>
            <Link href='/' className='inline-flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' aria-hidden='true' />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant='secondary' size='lg'>
            <Link href='/discord'>Report this on our Discord</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
