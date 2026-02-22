import React from 'react';
import { toggleVariants } from '@/components/ui/toggle';

export function ToggleGroup({ className = '', children, ...props }) { return <div className={`flex gap-1 ${className}`} {...props}>{children}</div>; }
export function ToggleGroupItem({ className = '', children, ...props }) { return <button className={`${toggleVariants()} ${className}`} {...props}>{children}</button>; }
