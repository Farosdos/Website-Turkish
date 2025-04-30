import { cn } from '~/lib/utils';
import type { HTMLAttributes } from 'react';

interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  colors?: string[];
}

export function GradientBackground({
  colors = ['bg-gradient-to-tr from-purple-600 from-0% via-sky-300 via-50% to-violet-400 to-100%'],
  className,
  ...props
}: GradientBackgroundProps) {
  return (
    <div
      aria-hidden='true'
      className={cn('-top-40 -z-10 sm:-top-30 absolute inset-x-1 transform-gpu overflow-hidden blur-3xl', className)}
      {...props}
    >
      <div
        className={cn(
          '-translate-x-1/5 relative left-[calc(100%-11rem)] aspect-[1155/678] w-[106.125rem] rotate-[30deg] bg-gradient-to-tr opacity-36 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]',
          ...colors,
        )}
        style={{
          clipPath:
            'polygon(24.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 15.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 12.4% 68.1%, 76.1% 97.7%, 74.1% 44.1%, 27.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 94.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
    </div>
  );
}