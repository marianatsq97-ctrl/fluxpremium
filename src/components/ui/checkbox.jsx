import React from 'react';

export function Checkbox({ checked, onCheckedChange, ...props }) {
  return (
    <input
      type="checkbox"
      checked={Boolean(checked)}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  );
}
