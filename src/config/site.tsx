import { Gauge, type LucideIcon, FolderOpenDot, User, Layers } from 'lucide-react';

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: '연철s 포트폴리오',
  description: '연철s 포트폴리오 관리 사이트입니다',
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: 'Dashboard',
    href: '/',
  },
  {
    icon: FolderOpenDot,
    name: 'Project',
    href: '/project',
  },
  {
    icon: User,
    name: 'Profile',
    href: '/profile',
  },
  {
    icon: Layers,
    name: 'Stacks',
    href: '/stacks',
  },
  // {
  //   icon: MessagesSquare,
  //   name: 'Ticket',
  //   href: '/ticket',
  // },
];
