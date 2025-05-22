'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { useToasterStore } from 'react-hot-toast';

export function Toast() {
  const ref = useRef<Element | null>(null);
  const { toasts } = useToasterStore();

  useEffect(() => {
    ref.current = document.getElementById('toast');
  }, []);

  if (!ref.current) return null;

  return createPortal(toasts.length > 0 && toasts.map(toast => <Toaster key={toast.id} />), ref.current);
}
