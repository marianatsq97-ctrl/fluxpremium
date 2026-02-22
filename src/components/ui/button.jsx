import React from 'react';
import { cn } from '@/lib/utils';

export function buttonVariants({ variant = 'default', size = 'default', className } = {}) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-input bg-background',
    ghost: 'hover:bg-accent',
    destructive: 'bg-destructive text-destructive-foreground',
  };
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    icon: 'h-9 w-9',
  };
  return cn('inline-flex items-center justify-center rounded-md text-sm', variants[variant], sizes[size], className);
}

export const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />;
});
Button.displayName = 'Button';
