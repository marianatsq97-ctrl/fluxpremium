import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle } from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();
  return (
    <ToastProvider>
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map(({ id, title, description, action }) => (
          <Toast key={id}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}
      </div>
    </ToastProvider>
  );
}
