import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ToastOptions {
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface Toast extends ToastOptions {
  id: number;
  message: string;
  duration: number;
}

interface ToastValue {
  toast: Toast | null;
  showToast: (message: string, options?: ToastOptions) => void;
  dismissToast: () => void;
}

const ToastContext = createContext<ToastValue | null>(null);

export function ToastProvider({ children }: {children: React.ReactNode;}) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    setToast({ id: Date.now(), message, ...options, duration: options.duration ?? 2400 });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), toast.duration);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ toast, showToast, dismissToast }), [toast, showToast, dismissToast]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}