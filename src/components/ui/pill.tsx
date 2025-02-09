import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';

import type * as React from 'react';

const pillVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium ring-1 transition-colors ring-inset',
  {
    variants: {
      variant: {
        default: 'bg-neutral-800/50 text-neutral-100 ring-neutral-700/50',
        success: 'bg-green-500/10 text-green-400 ring-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
        error: 'bg-red-500/10 text-red-400 ring-red-500/20',
        info: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
      },
      size: {
        default: 'px-3 py-1',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-4 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type PillProps<T extends React.ElementType = 'div'> = {
  asChild?: boolean;
  className?: string;
  as?: T;
} & VariantProps<typeof pillVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, 'className'>;

export function Pill<T extends React.ElementType = 'div'>({
  className,
  variant,
  size,
  as,
  ...props
}: PillProps<T>) {
  const Comp = as || 'div';
  return <Comp className={cn(pillVariants({ variant, size, className }))} {...props} />;
}
