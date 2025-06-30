'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useIconManager } from '@/hooks/use-icon-manager';
import { StackIcon } from './stack-icon';

interface IconManagerProps {
  className?: string;
}

export function IconManager({ className = '' }: IconManagerProps) {
  const { getCachedIcons, clearCache, removeFromCache, loadStackData, isIconLoading, hasIconError } = useIconManager();

  const [stacks, setStacks] = useState<Array<{ name: string; icon: string; color: string; category: string }>>([]);
  const [showDetails, setShowDetails] = useState(false);

  // 스택 데이터 로드 함수
  const loadStacksData = useCallback(async () => {
    try {
      const stacksData = await loadStackData();
      setStacks(stacksData);
    } catch (error) {
      console.error('Error loading stacks data:', error);
    }
  }, [loadStackData]);

  useEffect(() => {
    // 컴포넌트 마운트 후 데이터 로드
    loadStacksData();
  }, [loadStacksData]);

  const cachedIcons = getCachedIcons();

  return (
    <div className={`p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">아이콘 관리자</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? '간단히 보기' : '상세 보기'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              clearCache();
              // 캐시 클리어 후 스택 데이터 다시 로드
              setTimeout(() => {
                loadStacksData();
              }, 100);
            }}
          >
            캐시 클리어
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 캐시된 아이콘 정보 */}
        <div className="p-3 border rounded bg-white dark:bg-gray-700">
          <h4 className="font-medium mb-2">캐시된 아이콘 ({cachedIcons.length})</h4>
          {showDetails ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cachedIcons.map(iconName => (
                <div key={iconName} className="flex items-center justify-between text-sm">
                  <span className="font-mono">{iconName}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removeFromCache(iconName);
                      // 제거 후 스택 데이터 다시 로드
                      setTimeout(() => {
                        loadStacksData();
                      }, 100);
                    }}
                  >
                    제거
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cachedIcons.length}개의 아이콘이 캐시되어 있습니다.
            </p>
          )}
        </div>

        {/* 스택 정보 */}
        <div className="p-3 border rounded bg-white dark:bg-gray-700">
          <h4 className="font-medium mb-2">등록된 스택 ({stacks.length})</h4>
          {showDetails ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stacks.map(stack => (
                <div key={stack.name} className="flex items-center gap-2 text-sm">
                  <StackIcon name={stack.name} icon={stack.icon} color={stack.color} size={16} />
                  <span>{stack.name}</span>
                  <span className="text-xs text-gray-500">({stack.category})</span>
                  {isIconLoading(stack.icon) && <span className="text-xs text-blue-500">로딩중...</span>}
                  {hasIconError(stack.icon) && <span className="text-xs text-red-500">에러</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">{stacks.length}개의 스택이 등록되어 있습니다.</p>
          )}
        </div>
      </div>

      {/* 통계 정보 */}
      {showDetails && (
        <div className="mt-4 p-3 border rounded bg-white dark:bg-gray-700">
          <h4 className="font-medium mb-2">통계</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">캐시된 아이콘:</span>
              <span className="ml-2 font-medium">{cachedIcons.length}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">등록된 스택:</span>
              <span className="ml-2 font-medium">{stacks.length}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">로딩 중인 아이콘:</span>
              <span className="ml-2 font-medium text-blue-500">{stacks.filter(s => isIconLoading(s.icon)).length}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">에러가 있는 아이콘:</span>
              <span className="ml-2 font-medium text-red-500">{stacks.filter(s => hasIconError(s.icon)).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
