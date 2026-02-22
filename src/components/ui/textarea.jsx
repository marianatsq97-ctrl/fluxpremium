import React from 'react';

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea ref={ref} className={`min-h-[80px] w-full rounded-md border border-slate-700 bg-transparent px-3 py-2 text-sm ${className}`} {...props} />
));
Textarea.displayName = 'Textarea';
