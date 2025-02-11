'use client';

import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type * as React from 'react';
import { cn } from '~/lib/utils';

export function Select(props: React.ComponentPropsWithoutRef<typeof Root>) {
  return <Root {...props} />;
}

export function SelectGroup(props: React.ComponentPropsWithoutRef<typeof Group>) {
  return <Group {...props} />;
}

export function SelectValue(props: React.ComponentPropsWithoutRef<typeof Value>) {
  return <Value {...props} />;
}

export function SelectTrigger({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Trigger>) {
  return (
    <Trigger
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-neutral-800',
        'bg-neutral-900 px-3 py-2 text-neutral-200 text-sm',
        'ring-offset-neutral-900 placeholder:text-neutral-500',
        'focus:outline-none focus:ring-1 focus:ring-neutral-800',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <Icon asChild>
        <ChevronDown className='size-4 opacity-50' />
      </Icon>
    </Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentPropsWithoutRef<typeof Content>) {
  return (
    <Portal>
      <Content
        className={cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md',
          'border border-neutral-800 bg-neutral-900 text-neutral-200 shadow-md',
          'data-[state=closed]:animate-out data-[state=open]:animate-in',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1',
          'overflow-y-auto',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </Viewport>
        <SelectScrollDownButton />
      </Content>
    </Portal>
  );
}

export function SelectLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof Label>) {
  return <Label className={cn('px-2 py-1.5 font-semibold text-neutral-200 text-sm', className)} {...props} />;
}

export function SelectItem({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Item>) {
  return (
    <Item
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm',
        'outline-none focus:bg-neutral-800 focus:text-neutral-200',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className='absolute right-2 flex size-3.5 items-center justify-center'>
        <ItemIndicator>
          <Check className='size-4' />
        </ItemIndicator>
      </span>
      <ItemText>{children}</ItemText>
    </Item>
  );
}

export function SelectSeparator({ className, ...props }: React.ComponentPropsWithoutRef<typeof Separator>) {
  return <Separator className={cn('-mx-1 my-1 h-px bg-neutral-700', className)} {...props} />;
}

function SelectScrollUpButton({ className, ...props }: React.ComponentPropsWithoutRef<typeof ScrollUpButton>) {
  return (
    <ScrollUpButton className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
      <ChevronUp className='size-4' />
    </ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }: React.ComponentPropsWithoutRef<typeof ScrollDownButton>) {
  return (
    <ScrollDownButton className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
      <ChevronDown className='size-4' />
    </ScrollDownButton>
  );
}
