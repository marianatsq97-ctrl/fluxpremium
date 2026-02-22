import React from 'react';

export function Tabs({ children }) { return <div>{children}</div>; }
export function TabsList({ className = '', children }) { return <div className={className}>{children}</div>; }
export function TabsTrigger({ className = '', children, ...props }) { return <button className={className} {...props}>{children}</button>; }
export function TabsContent({ className = '', children }) { return <div className={className}>{children}</div>; }
