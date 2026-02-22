import React from 'react';

export function Select({ value, onValueChange, children }) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { value, onValueChange });
  });
}

export function SelectTrigger({ className = '', children, value, onValueChange }) {
  return (
    <select className={className} value={value} onChange={(e) => onValueChange?.(e.target.value)}>
      {children}
    </select>
  );
}

export function SelectValue() {
  return null;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
