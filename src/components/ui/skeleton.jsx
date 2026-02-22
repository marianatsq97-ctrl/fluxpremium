import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return <div className={`animate-pulse rounded-md bg-slate-700/40 ${className}`} {...props} />;
}
