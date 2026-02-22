import React from 'react';

export function toggleVariants() { return 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm'; }

export const Toggle = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <button ref={ref} className={`${toggleVariants()} ${className}`} {...props}>{children}</button>
));
Toggle.displayName = 'Toggle';
