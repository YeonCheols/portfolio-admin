import { type ComponentType } from 'react';

// 아이콘 라이브러리별 import 함수들
const iconLibraries = {
  // Bootstrap Icons
  Bs: async (iconName: string) => {
    const icons = await import('react-icons/bs');
    return (icons as any)[iconName];
  },

  // Font Awesome
  Fa: async (iconName: string) => {
    const icons = await import('react-icons/fa');
    return (icons as any)[iconName];
  },

  // Simple Icons
  Si: async (iconName: string) => {
    const icons = await import('react-icons/si');
    return (icons as any)[iconName];
  },

  // Material Design Icons
  Md: async (iconName: string) => {
    const icons = await import('react-icons/md');
    return (icons as any)[iconName];
  },

  // Heroicons
  Hi: async (iconName: string) => {
    const icons = await import('react-icons/hi');
    return (icons as any)[iconName];
  },

  // Feather Icons
  Fi: async (iconName: string) => {
    const icons = await import('react-icons/fi');
    return (icons as any)[iconName];
  },

  // Lucide Icons
  Lu: async (iconName: string) => {
    const icons = await import('react-icons/lu');
    return (icons as any)[iconName];
  },

  // Tabler Icons
  Tb: async (iconName: string) => {
    const icons = await import('react-icons/tb');
    return (icons as any)[iconName];
  },

  // Ionicons
  Io: async (iconName: string) => {
    const icons = await import('react-icons/io');
    return (icons as any)[iconName];
  },

  // Ant Design Icons
  Ai: async (iconName: string) => {
    const icons = await import('react-icons/ai');
    return (icons as any)[iconName];
  },

  // Game Icons
  Gi: async (iconName: string) => {
    const icons = await import('react-icons/gi');
    return (icons as any)[iconName];
  },

  // Weather Icons
  Wi: async (iconName: string) => {
    const icons = await import('react-icons/wi');
    return (icons as any)[iconName];
  },

  // Dev Icons
  Di: async (iconName: string) => {
    const icons = await import('react-icons/di');
    return (icons as any)[iconName];
  },

  // Biotech Icons
  Bi: async (iconName: string) => {
    const icons = await import('react-icons/bi');
    return (icons as any)[iconName];
  },

  // Carbon Icons
  Cg: async (iconName: string) => {
    const icons = await import('react-icons/cg');
    return (icons as any)[iconName];
  },

  // Grommet Icons
  Gr: async (iconName: string) => {
    const icons = await import('react-icons/gr');
    return (icons as any)[iconName];
  },

  // Radix Icons
  Rx: async (iconName: string) => {
    const icons = await import('react-icons/rx');
    return (icons as any)[iconName];
  },

  // Remix Icons
  Ri: async (iconName: string) => {
    const icons = await import('react-icons/ri');
    return (icons as any)[iconName];
  },

  // VSCode Icons
  Vsc: async (iconName: string) => {
    const icons = await import('react-icons/vsc');
    return (icons as any)[iconName];
  },
};

// 아이콘 캐시
const iconCache = new Map<string, ComponentType<any>>();

// 아이콘 이름을 파싱하는 함수
function parseIconName(iconName: string): { library: string; name: string } | null {
  // 아이콘 이름 패턴: [Library][Name] (예: SiReact, BsRobot, FaSass)
  const match = iconName.match(/^([A-Z][a-z])(.+)$/);
  if (!match) return null;

  const [, library, name] = match;
  return { library, name };
}

// 동적으로 아이콘을 로드하는 함수
export async function loadIcon(iconName: string): Promise<ComponentType<any> | null> {
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
    // 아이콘 로드
    const IconComponent = await iconLibraries[library as keyof typeof iconLibraries](library + name);

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
}

// 캐시를 클리어하는 함수
export function clearIconCache(): void {
  iconCache.clear();
}

// 특정 아이콘을 캐시에서 제거하는 함수
export function removeIconFromCache(iconName: string): void {
  iconCache.delete(iconName);
}

// 캐시된 아이콘 목록을 반환하는 함수
export function getCachedIcons(): string[] {
  return Array.from(iconCache.keys());
}

// 아이콘 라이브러리 목록을 반환하는 함수
export function getSupportedLibraries(): string[] {
  return Object.keys(iconLibraries);
}
