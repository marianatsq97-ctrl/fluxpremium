import React from 'react';

export const Progress = React.forwardRef(({ value = 0, className = '', ...props }, ref) => (
  <div ref={ref} className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-700 ${className}`} {...props}>
    <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
));
Progress.displayName = 'Progress';
