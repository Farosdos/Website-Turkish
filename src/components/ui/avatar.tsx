'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '~/lib/utils';

import * as React from 'react';

interface AvatarBaseProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  asChild?: boolean;
}

export function Avatar({ className, ...props }: AvatarBaseProps) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn('aspect-square h-full w-full', className)} {...props} />;
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-neutral-800', className)}
      {...props}
    />
  );
}
