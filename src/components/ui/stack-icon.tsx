import { type JSX, useEffect, useState } from 'react';
import { type ComponentType } from 'react';

// 정적으로 아이콘들을 import
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';
import * as DiIcons from 'react-icons/di';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as IoIcons from 'react-icons/io';
import * as LuIcons from 'react-icons/lu';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as RxIcons from 'react-icons/rx';
import * as SiIcons from 'react-icons/si';
import * as TbIcons from 'react-icons/tb';
import * as VscIcons from 'react-icons/vsc';
import * as WiIcons from 'react-icons/wi';

// 스택 메타데이터 타입
interface StackMetadata {
  name: string;
  icon: string;
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tool' | 'other';
}

// 아이콘 라이브러리 매핑
const iconLibraries = {
  Si: SiIcons,
  Bs: BsIcons,
  Fa: FaIcons,
  Md: MdIcons,
  Hi: HiIcons,
  Fi: FiIcons,
  Lu: LuIcons,
  Tb: TbIcons,
  Io: IoIcons,
  Ai: AiIcons,
  Gi: GiIcons,
  Wi: WiIcons,
  Di: DiIcons,
  Bi: BiIcons,
  Cg: CgIcons,
  Gr: GrIcons,
  Rx: RxIcons,
  Ri: RiIcons,
  Vsc: VscIcons,
};

// 아이콘 이름을 파싱하는 함수
function parseIconName(iconName: string): { library: string; name: string } | null {
  const match = iconName.match(/^([A-Z][a-z])(.+)$/);
  if (!match) return null;
  const [, library, name] = match;
  return { library, name };
}

// 아이콘 컴포넌트를 가져오는 함수
function getIconComponent(iconName: string): ComponentType<any> | null {
  const parsed = parseIconName(iconName);
  if (!parsed) return null;

  const { library, name } = parsed;
  const iconLibrary = iconLibraries[library as keyof typeof iconLibraries];

  if (!iconLibrary) return null;

  return (iconLibrary as any)[library + name] || null;
}

// 스택 데이터를 가져오는 커스텀 훅
function useStackData(name: string) {
  const [stackData, setStackData] = useState<StackMetadata | null>(null);

  useEffect(() => {
    const fetchStackData = async () => {
      try {
        const response = await fetch('/api/stacks');
        if (response.ok) {
          const result = await response.json();
          if (result.status) {
            const foundStack = result.data.find((stack: StackMetadata) => stack.name === name);
            setStackData(foundStack || null);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch stack data:', error);
      }
    };

    fetchStackData();
  }, [name]);

  return stackData;
}

export interface StackIconProps {
  name: string;
  icon: string;
  color?: string;
  size?: number;
  className?: string;
}

// TODO : 아이콘 컴포넌트 공통 라이브러리로 이관
export function StackIcon({ name, icon, color = '', size = 20, className = '' }: StackIconProps): JSX.Element {
  const stackData = useStackData(name);
  const IconComponent = getIconComponent(icon);

  // NOTE: 아이콘을 찾을 수 없는 경우
  if (!IconComponent) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        style={{ width: size, height: size }}
        title={name}
      />
    );
  }

  // NOTE: 스택 데이터에서 색상을 가져오거나 props로 전달된 색상 사용
  const iconColor = stackData?.color || color;

  return <IconComponent size={size} className={`${iconColor} ${className}`} title={name} />;
}

// 스택 태그 컴포넌트
export interface StackTagProps {
  name: string;
  icon: string;
  color?: string;
  size?: number;
  className?: string;
  showName?: boolean;
}

export function StackTag({
  name,
  icon,
  color = '',
  size = 16,
  className = '',
  showName = false,
}: StackTagProps): JSX.Element {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <StackIcon name={name} icon={icon} color={color} size={size} />
      {showName && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>}
    </div>
  );
}
