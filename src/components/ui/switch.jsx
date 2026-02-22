import React from 'react';

export function Switch({ checked, onCheckedChange }) {
  return <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onCheckedChange?.(e.target.checked)} />;
}
