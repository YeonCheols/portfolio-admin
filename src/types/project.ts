import { type ReactElement } from 'react';

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  stacks: string;
  image: string;
  content: string;
  link_demo: string;
  link_github: string;
  is_show: boolean;
}

export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  stacks: string;
  link_github: string;
  link_demo: string;
  content: string;
  description: string;
  is_show: boolean;
  updated_at: string;
  buttonGroup: ReactElement;
}
