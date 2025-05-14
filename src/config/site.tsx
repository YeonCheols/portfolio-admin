import { Gauge, type LucideIcon, MessagesSquare, FolderOpenDot } from 'lucide-react';

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: '연철s 포트폴리오',
  description: '연철s 포트폴리오 프로젝트 관리 사이트입니다',
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
    icon: MessagesSquare,
    name: 'Ticket',
    href: '/ticket',
  },
];
