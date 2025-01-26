import { cn } from '~/lib/utils';

import * as React from 'react';

export type CardProps<T extends React.ElementType = 'div'> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'className'>;

export function Card<T extends React.ElementType = 'div'>({ className, as, ...props }: CardProps<T>) {
  const Comp = as || 'div';
  return (
    <Comp
      className={cn('rounded-xl bg-neutral-800/50 p-8 ring-1 ring-neutral-700/50 backdrop-blur-sm', className)}
      {...props}
    />
  );
}
Card.displayName = 'Card';

export function CardHeader<T extends React.ElementType = 'div'>({ className, as, ...props }: CardProps<T>) {
  const Comp = as || 'div';
  return <Comp className={cn('flex items-center justify-between', className)} {...props} />;
}
CardHeader.displayName = 'CardHeader';

export function CardTitle<T extends React.ElementType = 'h2'>({ className, as, ...props }: CardProps<T>) {
  const Comp = as || 'h2';
  return <Comp className={cn('text-2xl font-semibold text-white', className)} {...props} />;
}
CardTitle.displayName = 'CardTitle';

export function CardContent<T extends React.ElementType = 'div'>({ className, as, ...props }: CardProps<T>) {
  const Comp = as || 'div';
  return <Comp className={cn('mt-6', className)} {...props} />;
}
CardContent.displayName = 'CardContent';
