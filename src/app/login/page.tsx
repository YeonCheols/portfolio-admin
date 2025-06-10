'use client';

import { useEffect } from 'react';
import { usePropsContext } from '@/lib/context/props';

export default function Login() {
  const { setContextProps } = usePropsContext();

  useEffect(() => {
    setContextProps({ noneLayout: true });
  }, []);

  return <div className="mt-10 space-y-8"></div>;
}
