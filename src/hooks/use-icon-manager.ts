import { useCallback } from 'react';
import { type ComponentType } from 'react';
import { loadIcon, clearIconCache, removeIconFromCache, getCachedIcons } from '@/lib/icon-loader';

// 스택 메타데이터 타입
interface StackMetadata {
  name: string;
  icon: string;
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tool' | 'other';
}

// 아이콘 상태 타입
interface IconState {
  component: ComponentType<any> | null;
  isLoading: boolean;
  error: string | null;
}

// 훅 반환 타입
interface UseIconManagerReturn {
  // 아이콘 로딩
  loadIcon: (iconName: string) => Promise<ComponentType<any> | null>;

  // 아이콘 상태 관리
  getIconState: (iconName: string) => IconState;

  // 캐시 관리
  clearCache: () => void;
  removeFromCache: (iconName: string) => void;
  getCachedIcons: () => string[];

  // 스택 데이터 관리
  loadStackData: () => Promise<StackMetadata[]>;
  getStackData: (name: string) => StackMetadata | null;

  // 유틸리티
  isIconLoading: (iconName: string) => boolean;
  hasIconError: (iconName: string) => boolean;
}

// 전역 상태 관리 (모듈 레벨)
const iconStates = new Map<string, IconState>();
let stacksCache: StackMetadata[] | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 스택 데이터를 가져오는 함수
async function fetchStacksData(): Promise<StackMetadata[]> {
  if (stacksCache && Date.now() < cacheExpiry) {
    return stacksCache;
  }

  try {
    const response = await fetch('/api/stacks');
    if (response.ok) {
      const result = await response.json();
      if (result.status) {
        stacksCache = result.data;
        cacheExpiry = Date.now() + CACHE_DURATION;
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch stacks data:', error);
  }

  return [];
}

// 아이콘 상태 업데이트 함수 (React 상태와 독립적)
function updateIconState(iconName: string, updates: Partial<IconState>) {
  const currentState = iconStates.get(iconName) || {
    component: null,
    isLoading: false,
    error: null,
  };
  iconStates.set(iconName, { ...currentState, ...updates });
}

export function useIconManager(): UseIconManagerReturn {
  // 아이콘 로딩 함수
  const loadIconWithState = useCallback(async (iconName: string): Promise<ComponentType<any> | null> => {
    // 이미 로딩 중이거나 로드된 경우
    const currentState = iconStates.get(iconName);
    if (currentState?.component) {
      return currentState.component;
    }

    if (currentState?.isLoading) {
      return null; // 로딩 중이면 null 반환
    }

    // 로딩 상태 시작
    updateIconState(iconName, { isLoading: true, error: null });

    try {
      const component = await loadIcon(iconName);

      if (component) {
        updateIconState(iconName, { component, isLoading: false, error: null });
        return component;
      } else {
        updateIconState(iconName, {
          component: null,
          isLoading: false,
          error: `Icon not found: ${iconName}`,
        });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load icon';
      updateIconState(iconName, {
        component: null,
        isLoading: false,
        error: errorMessage,
      });
      return null;
    }
  }, []);

  // 아이콘 상태 가져오기
  const getIconState = useCallback((iconName: string): IconState => {
    return (
      iconStates.get(iconName) || {
        component: null,
        isLoading: false,
        error: null,
      }
    );
  }, []);

  // 캐시 클리어
  const clearCacheWithState = useCallback(() => {
    clearIconCache();
    iconStates.clear();
    stacksCache = null;
    cacheExpiry = 0;
  }, []);

  // 특정 아이콘 캐시에서 제거
  const removeFromCacheWithState = useCallback((iconName: string) => {
    removeIconFromCache(iconName);
    iconStates.delete(iconName);
  }, []);

  // 캐시된 아이콘 목록
  const getCachedIconsWithState = useCallback(() => {
    return getCachedIcons();
  }, []);

  // 스택 데이터 로드
  const loadStackData = useCallback(async (): Promise<StackMetadata[]> => {
    return await fetchStacksData();
  }, []);

  // 스택 데이터 가져오기
  const getStackData = useCallback((name: string): StackMetadata | null => {
    if (!stacksCache) return null;
    return stacksCache.find(stack => stack.name === name) || null;
  }, []);

  // 아이콘 로딩 상태 확인
  const isIconLoading = useCallback(
    (iconName: string): boolean => {
      return getIconState(iconName).isLoading;
    },
    [getIconState],
  );

  // 아이콘 에러 상태 확인
  const hasIconError = useCallback(
    (iconName: string): boolean => {
      return getIconState(iconName).error !== null;
    },
    [getIconState],
  );

  return {
    loadIcon: loadIconWithState,
    getIconState,
    clearCache: clearCacheWithState,
    removeFromCache: removeFromCacheWithState,
    getCachedIcons: getCachedIconsWithState,
    loadStackData,
    getStackData,
    isIconLoading,
    hasIconError,
  };
}
