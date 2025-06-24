import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect, useRef, type FC } from 'react';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

const ProgressBar: FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigating = useRef(false);
  const navigationTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isNavigating.current) return;

    isNavigating.current = true;
    NProgress.start();

    navigationTimeout.current = setTimeout(() => {
      NProgress.done();
      isNavigating.current = false;
    }, 500);

    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      NProgress.done();
      isNavigating.current = false;
    };
  }, [pathname, searchParams]);

  return null;
};

export default ProgressBar;
