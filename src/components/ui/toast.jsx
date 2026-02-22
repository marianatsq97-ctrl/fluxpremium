import React from 'react';

export function ToastProvider({ children }) { return <>{children}</>; }
export function ToastViewport() { return <div className="fixed right-4 top-4 z-50 space-y-2" />; }
export function Toast({ children, className = '' }) { return <div className={`rounded-md border bg-slate-900 p-4 text-white ${className}`}>{children}</div>; }
export function ToastTitle({ children }) { return <div className="font-semibold">{children}</div>; }
export function ToastDescription({ children }) { return <div className="text-sm text-slate-300">{children}</div>; }
export function ToastClose(props) { return <button {...props}>×</button>; }
export function ToastAction({ children, ...props }) { return <button {...props}>{children}</button>; }
