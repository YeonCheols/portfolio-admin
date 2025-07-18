import { iconLibraries } from '@yeoncheols/portfolio-core-ui';
import { type ComponentType } from 'react';

// 아이콘 캐시
const iconCache = new Map<string, ComponentType<any>>();

// 아이콘 이름을 파싱하는 함수
const parseIconName = (iconName: string): { library: string; name: string } | null => {
  // 아이콘 이름 패턴: [Library][Name] (예: SiReact, BsRobot, FaSass)
  const match = iconName.match(/^([A-Z][a-z])(.+)$/);
  if (!match) return null;

  const [, library, name] = match;
  return { library, name };
};

// 동적으로 아이콘을 로드하는 함수
export const loadIcon = (iconName: string): ComponentType<any> | null => {
  // 캐시된 아이콘이 있으면 반환
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  // 아이콘 이름 파싱
  const parsed = parseIconName(iconName);
  if (!parsed) {
    console.warn(`Invalid icon name format: ${iconName}`);
    return null;
  }

  const { library, name } = parsed;

  // 지원하는 라이브러리인지 확인
  if (!iconLibraries[library as keyof typeof iconLibraries]) {
    console.warn(`Unsupported icon library: ${library}`);
    return null;
  }

  try {
    // 아이콘 라이브러리에서 직접 접근
    const iconLibrary = iconLibraries[library as keyof typeof iconLibraries];
    const IconComponent = (iconLibrary as any)[library + name];

    if (IconComponent) {
      // 캐시에 저장
      iconCache.set(iconName, IconComponent);
      return IconComponent;
    } else {
      console.warn(`Icon not found: ${iconName}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to load icon ${iconName}:`, error);
    return null;
  }
};

// 캐시를 클리어하는 함수
export const clearIconCache = (): void => {
  iconCache.clear();
};

// 특정 아이콘을 캐시에서 제거하는 함수
export const removeIconFromCache = (iconName: string): void => {
  iconCache.delete(iconName);
};

// 캐시된 아이콘 목록을 반환하는 함수
export const getCachedIcons = (): string[] => {
  return Array.from(iconCache.keys());
};

// 아이콘 라이브러리 목록을 반환하는 함수
export const getSupportedLibraries = (): string[] => {
  return Object.keys(iconLibraries);
};
