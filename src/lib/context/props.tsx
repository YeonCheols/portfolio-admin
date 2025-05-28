'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface PropsContextType<T> {
  contextProps: T;
  setContextProps: (value: T | null) => void;
}

const PropsContext = createContext<PropsContextType<any> | undefined>(undefined);

interface PropsProviderProps<T> {
  children: ReactNode;
  initialValue?: T;
}

export function PropsProvider<T>({ children, initialValue }: PropsProviderProps<T>) {
  const [contextProps, setContextProps] = useState<T | null>(initialValue ?? null);

  const pathname = usePathname();

  useEffect(() => {
    setContextProps(null);
  }, [pathname]);

  return <PropsContext.Provider value={{ contextProps, setContextProps }}>{children}</PropsContext.Provider>;
}

// props 사용을 위한 hook
export function usePropsContext<T>() {
  const context = useContext(PropsContext);
  if (!context) {
    throw new Error('usePropsContext Provider를 찾을 수 없습니다.');
  }
  return context as PropsContextType<T>;
}
