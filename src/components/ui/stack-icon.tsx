import { type JSX } from 'react';
import { BsFillBootstrapFill, BsRobot } from 'react-icons/bs';
import { FaSass } from 'react-icons/fa';
import {
  SiAngular,
  SiApollographql,
  SiCss3,
  SiExpress,
  SiFirebase,
  SiGatsby,
  SiGraphql,
  SiJavascript,
  SiJest,
  SiJquery,
  SiLaravel,
  SiMui,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiNuxtdotjs,
  SiPhp,
  SiPrisma,
  SiPwa,
  SiReact,
  SiRedux,
  SiSocketdotio,
  SiStorybook,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVuedotjs,
  SiWebpack,
  SiWordpress,
} from 'react-icons/si';

// 아이콘 매핑 객체
const ICON_MAP: { [key: string]: any } = {
  SiPhp: SiPhp,
  SiJavascript: SiJavascript,
  SiTypescript: SiTypescript,
  SiNextdotjs: SiNextdotjs,
  SiReact: SiReact,
  SiTailwindcss: SiTailwindcss,
  BsFillBootstrapFill: BsFillBootstrapFill,
  SiGraphql: SiGraphql,
  SiApollographql: SiApollographql,
  SiWordpress: SiWordpress,
  SiLaravel: SiLaravel,
  SiMui: SiMui,
  SiVite: SiVite,
  SiPrisma: SiPrisma,
  SiFirebase: SiFirebase,
  BsRobot: BsRobot,
  SiAngular: SiAngular,
  SiVuedotjs: SiVuedotjs,
  SiNuxtdotjs: SiNuxtdotjs,
  SiNodedotjs: SiNodedotjs,
  SiGatsby: SiGatsby,
  SiRedux: SiRedux,
  SiWebpack: SiWebpack,
  SiStyledcomponents: SiStyledcomponents,
  SiPwa: SiPwa,
  SiNginx: SiNginx,
  SiJest: SiJest,
  SiStorybook: SiStorybook,
  SiCss3: SiCss3,
  SiSocketdotio: SiSocketdotio,
  SiExpress: SiExpress,
  SiJquery: SiJquery,
  FaSass: FaSass,
};

export interface StackIconProps {
  name: string;
  icon: string;
  color?: string;
  size?: number;
  className?: string;
}

export function StackIcon({ name, icon, color = '', size = 20, className = '' }: StackIconProps): JSX.Element {
  const IconComponent = ICON_MAP[icon];

  if (!IconComponent) {
    // 아이콘이 없을 경우 기본 아이콘 또는 텍스트 표시
    return (
      <div
        className={`flex items-center justify-center w-${size} h-${size} rounded bg-gray-200 dark:bg-gray-700 text-xs font-medium ${className}`}
        title={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return <IconComponent size={size} className={`${color} ${className}`} title={name} />;
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
