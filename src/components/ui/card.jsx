import React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={cn('rounded-xl border border-slate-800 bg-slate-900/50 text-white', className)} {...props} />
));
Card.displayName = 'Card';
