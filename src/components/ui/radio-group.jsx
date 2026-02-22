import React from 'react';

export function RadioGroup({ className = '', children, ...props }) {
  return <div className={`grid gap-2 ${className}`} role="radiogroup" {...props}>{children}</div>;
}

export function RadioGroupItem({ checked, onCheckedChange, ...props }) {
  return <input type="radio" checked={Boolean(checked)} onChange={(e) => onCheckedChange?.(e.target.checked)} {...props} />;
}
