'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.info(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
        <p className="mb-6">
          죄송합니다. 예기치 않은 오류가 발생했습니다.
          <br /> 다시 시도해주세요.
        </p>
        <Button
          variant="secondary"
          className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-600 mr-4"
          size="sm"
          onClick={() => reset()}
        >
          다시 시도
        </Button>
        <Button
          variant="secondary"
          className="bg-green-200 dark:bg-green-500 hover:bg-green-400 dark:hover:bg-green-600 mb-2"
          size="sm"
          onClick={() => router.back()}
        >
          이전 페이지로 이동
        </Button>
      </div>
    </div>
  );
}
