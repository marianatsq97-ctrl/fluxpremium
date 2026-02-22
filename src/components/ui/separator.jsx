import React from 'react';

export const Separator = React.forwardRef(({ orientation = 'horizontal', className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`${orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'} bg-slate-700 ${className}`}
    {...props}
  />
));
Separator.displayName = 'Separator';
