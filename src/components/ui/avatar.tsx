'use client';

import { Fallback, Image, Root } from '@radix-ui/react-avatar';
import type * as React from 'react';
import { cn } from '~/lib/utils';

interface AvatarBaseProps extends React.ComponentPropsWithoutRef<typeof Root> {
  asChild?: boolean;
}

export function Avatar({ className, ...props }: AvatarBaseProps) {
  return <Root className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />;
}

export function AvatarImage({ className, ...props }: React.ComponentPropsWithoutRef<typeof Image>) {
  return <Image className={cn('aspect-square h-full w-full object-cover', className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: React.ComponentPropsWithoutRef<typeof Fallback>) {
  return (
    <Fallback
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-neutral-800', className)}
      {...props}
    />
  );
}
