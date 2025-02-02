import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';

import * as React from 'react';

export const buttonVariants = cva(
  'ring-offset-background inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white text-neutral-900 shadow-sm hover:bg-neutral-100/90',
        secondary: 'bg-neutral-800 text-neutral-50 shadow-sm hover:bg-neutral-800/80',
        ghost: 'text-neutral-100 hover:bg-neutral-800/80',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-7',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps<T extends React.ElementType = 'button'> = {
  asChild?: boolean;
  className?: string;
  as?: T;
} & VariantProps<typeof buttonVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, 'className'>;

export function Button<T extends React.ElementType = 'button'>({
  className,
  variant,
  size,
  asChild = false,
  as,
  ...props
}: ButtonProps<T>) {
  const Comp = asChild ? Slot : as || 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
