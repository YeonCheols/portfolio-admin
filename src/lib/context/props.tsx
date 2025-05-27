'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface PropsContextType<T> {
  contextProps: T | null;
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
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setContextProps(null);
    }
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
